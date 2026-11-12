import subprocess
import sys
import os
import time

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(PROJECT_ROOT, "frontend")

def main():
    print("=" * 60)
    print("Starting ShopKaro AI Commerce Intelligence Platform")
    print("=" * 60)
    
    # 1. Start FastAPI Backend
    print("[1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...")
    backend_cmd = [sys.executable, "-m", "uvicorn", "src.api.main:app", "--host", "127.0.0.1", "--port", "8000"]
    backend_proc = subprocess.Popen(backend_cmd, cwd=PROJECT_ROOT)
    
    # 2. Wait 3 seconds for backend to initialize
    time.sleep(3)
    
    # 3. Start Next.js Frontend
    print("[2/2] Starting Next.js Cinematic UI Frontend on http://localhost:3000 ...")
    # Use npm start since the production build is already created
    npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
    frontend_proc = subprocess.Popen([npm_cmd, "start", "--", "-p", "3000"], cwd=FRONTEND_DIR)
    
    print("\n" + "=" * 60)
    print("✅ BOTH SERVERS ARE RUNNING!")
    print("👉 Next.js Frontend: http://localhost:3000")
    print("👉 FastAPI Backend & Docs: http://localhost:8000/docs")
    print("=" * 60)
    print("Press Ctrl+C to stop both servers.\n")
    
    try:
        while True:
            time.sleep(1)
            if backend_proc.poll() is not None:
                print("Backend exited unexpectedly!")
                break
            if frontend_proc.poll() is not None:
                print("Frontend exited unexpectedly!")
                break
    except KeyboardInterrupt:
        print("\nStopping servers...")
    finally:
        backend_proc.terminate()
        frontend_proc.terminate()

if __name__ == "__main__":
    main()

