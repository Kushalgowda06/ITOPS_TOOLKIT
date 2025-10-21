#Author: Anish Bhandiwad
#Date: 21-08-2025

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pathlib import Path
import shutil
import re
import os
import json
from datetime import datetime

SCRIPT_PATH = os.path.dirname(__file__)

# =========================
# Utilities
# =========================
# Sanitize and normalize a user-supplied filename:
# - strip directories
# - allow [A-Za-z0-9._-]
# - preserve a single extension (suffix)
# - ensure non-empty base
class UploadService:
        
    UPLOAD_DIR = Path(SCRIPT_PATH + "/static/")

    def __init__(self):
        upload_dir = self.UPLOAD_DIR
        # Ensure upload dir exists
        upload_dir.mkdir(parents=True, exist_ok=True)
    
    #@staticmethod
    def secure_filename(self, name: str) -> str:
        # Only keep the final component to prevent path traversal
        name = Path(name or "").name

        # Separate base and extension (single suffix)
        base = Path(name).stem
        ext = Path(name).suffix  # includes the dot, e.g. ".jpg"

        # Normalize base: allow alnum, dot, dash, underscore
        base = re.sub(r"[^A-Za-z0-9._-]+", "_", base).strip("._-")
        if not base:
            base = "file"

        # Normalize extension similarly (keep dot if present)
        if ext:
            raw_ext = ext[1:]  # drop leading dot for validation
            raw_ext = re.sub(r"[^A-Za-z0-9._-]+", "", raw_ext)
            ext = f".{raw_ext}" if raw_ext else ""
        else:
            ext = ""

        # Avoid names like ".bashrc" with empty base
        return f"{base}{ext}"

    # Given a desired destination path, return a path that doesn't exist by
    # appending -1, -2, ... before the extension if necessary.
    def disambiguate_path(self, dest: Path) -> Path:
        if not dest.exists():
            return dest
        base = dest.stem
        ext = dest.suffix
        now = datetime.now()
        custom_format = now.strftime("%Y-%m-%d-%H:%M:%S")
        while True:
            candidate = dest.with_name(f"{base}-{custom_format}{ext}")
            if not candidate.exists():
                return candidate

    def upload_file(self, file: UploadFile = File(...)):
        upload_dir = self.UPLOAD_DIR
        print(file.filename)
        safe_name = self.secure_filename(file.filename)
        print(file.filename)
        dest = self.disambiguate_path(upload_dir / safe_name)

        # Stream to disk
        try:
            with dest.open("wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as e:
            # Clean up partial file
            try:
                if dest.exists():
                    dest.unlink(missing_ok=True)
            except Exception:
                pass
            raise HTTPException(status_code=500, detail=f"Failed to save file: {e}")
        '''
        finally:
            file.close()
        '''

        # Return what it was saved as and where
        return {
            "message": "File Uploaded Successfully",
            "original_filename": file.filename,
            "saved_as": dest.name,
            "path": str(dest),
            "size_bytes": dest.stat().st_size if dest.exists() else None,
        }


