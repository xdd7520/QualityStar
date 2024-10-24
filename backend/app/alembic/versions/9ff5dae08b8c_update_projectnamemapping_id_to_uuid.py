"""update ProjectNameMapping id to uuid and handle foreign key constraints
Revision ID: 9ff5dae08b8c
Revises: f95813c2b330
Create Date: 2024-10-25 01:23:29.472211
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4
from sqlalchemy.sql import table, column
from sqlalchemy import select

# revision identifiers, used by Alembic
revision = '9ff5dae08b8c'
down_revision = 'f95813c2b330'
branch_labels = None
depends_on = None

def upgrade():
    # 1. Drop the foreign key constraint first
    op.drop_constraint(
        'gather_interface_project_name_mapping_id_fkey',
        'gather_interface'
    )

    # 2. Add new UUID columns to both tables
    op.add_column('project_name_mapping',
        sa.Column('new_id', UUID(as_uuid=True), nullable=True)
    )
    op.add_column('gather_interface',
        sa.Column('new_project_name_mapping_id', UUID(as_uuid=True), nullable=True)
    )

    # 3. Create temporary table references
    project_name_mapping = table('project_name_mapping',
        column('id', sa.Integer),
        column('new_id', UUID(as_uuid=True))
    )

    # 4. Generate UUIDs for project_name_mapping
    connection = op.get_bind()
    connection.execute(
        project_name_mapping.update().values(
            new_id=sa.text('uuid_generate_v4()')
        )
    )

    # 5. Create a mapping of old IDs to new UUIDs - 修正的查询语法
    result = connection.execute(
        select(
            project_name_mapping.c.id,
            project_name_mapping.c.new_id
        )
    ).fetchall()

    # 6. Update foreign keys in gather_interface
    for old_id, new_id in result:
        connection.execute(
            sa.text(
                'UPDATE gather_interface SET new_project_name_mapping_id = :new_id '
                'WHERE project_name_mapping_id = :old_id'
            ),
            {'new_id': new_id, 'old_id': old_id}
        )

    # 7. Make the new columns not nullable
    op.alter_column('project_name_mapping', 'new_id',
        nullable=False
    )
    op.alter_column('gather_interface', 'new_project_name_mapping_id',
        nullable=False
    )

    # 8. Drop the primary key constraint
    op.drop_constraint('project_name_mapping_pkey', 'project_name_mapping')

    # 9. Drop old columns
    op.drop_column('project_name_mapping', 'id')
    op.drop_column('gather_interface', 'project_name_mapping_id')

    # 10. Rename new columns
    op.alter_column('project_name_mapping', 'new_id',
        new_column_name='id'
    )
    op.alter_column('gather_interface', 'new_project_name_mapping_id',
        new_column_name='project_name_mapping_id'
    )

    # 11. Add primary key constraint to the new id column
    op.create_primary_key(
        'project_name_mapping_pkey', 'project_name_mapping', ['id']
    )

    # 12. Recreate the foreign key constraint with UUID type
    op.create_foreign_key(
        'gather_interface_project_name_mapping_id_fkey',
        'gather_interface', 'project_name_mapping',
        ['project_name_mapping_id'], ['id']
    )

def downgrade():
    # 1. Drop the foreign key constraint
    op.drop_constraint(
        'gather_interface_project_name_mapping_id_fkey',
        'gather_interface'
    )

    # 2. Add old integer columns
    op.add_column('project_name_mapping',
        sa.Column('old_id', sa.INTEGER(), autoincrement=True, nullable=True)
    )
    op.add_column('gather_interface',
        sa.Column('old_project_name_mapping_id', sa.INTEGER(), nullable=True)
    )

    # 3. Generate sequence numbers for old_id
    op.execute('ALTER TABLE project_name_mapping ALTER COLUMN old_id SET DEFAULT nextval(\'project_name_mapping_id_seq\')')
    op.execute('UPDATE project_name_mapping SET old_id = nextval(\'project_name_mapping_id_seq\')')

    # 4. Create a mapping of new UUIDs to old IDs - 修正的查询语法
    connection = op.get_bind()
    result = connection.execute(
        select(
            sa.text('old_id'),
            sa.text('id')
        ).select_from(sa.text('project_name_mapping'))
    ).fetchall()

    # 5. Update foreign keys in gather_interface
    for old_id, uuid_id in result:
        connection.execute(
            sa.text(
                'UPDATE gather_interface SET old_project_name_mapping_id = :old_id '
                'WHERE project_name_mapping_id = :uuid_id'
            ),
            {'old_id': old_id, 'uuid_id': uuid_id}
        )

    # 6. Make old columns not nullable
    op.alter_column('project_name_mapping', 'old_id',
        nullable=False
    )
    op.alter_column('gather_interface', 'old_project_name_mapping_id',
        nullable=False
    )

    # 7. Drop the primary key constraint
    op.drop_constraint('project_name_mapping_pkey', 'project_name_mapping')

    # 8. Drop the UUID columns
    op.drop_column('project_name_mapping', 'id')
    op.drop_column('gather_interface', 'project_name_mapping_id')

    # 9. Rename old columns back
    op.alter_column('project_name_mapping', 'old_id',
        new_column_name='id'
    )
    op.alter_column('gather_interface', 'old_project_name_mapping_id',
        new_column_name='project_name_mapping_id'
    )

    # 10. Add primary key constraint back
    op.create_primary_key(
        'project_name_mapping_pkey', 'project_name_mapping', ['id']
    )

    # 11. Recreate the foreign key constraint with INTEGER type
    op.create_foreign_key(
        'gather_interface_project_name_mapping_id_fkey',
        'gather_interface', 'project_name_mapping',
        ['project_name_mapping_id'], ['id']
    )