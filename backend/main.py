# Created by xdd at 2024/6/4
import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        app="app.main:app",
        reload=True,
    )
