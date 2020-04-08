import os
import random
from pathlib import Path
import shutil
curDir = os.getcwd()

def compiler(string):
    path = os.path.join(curDir, random.random())
    Path(path).mkdir()


    shutil.rmtree(path)