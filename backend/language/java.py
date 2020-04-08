import os
import random
from subprocess import getstatusoutput
from pathlib import Path
import shutil

curDir = os.getcwd()


def compiler(string):
    subDir = str(random.random()).replace(".", "")
    dirPath = os.path.join(curDir, subDir)
    filePath = os.path.join(dirPath, "Demo.java")
    Path(dirPath).mkdir()
    with open(filePath, "w+") as fp:
        fp.write(string)


    cmd = f"cd {dirPath} && export CLASSPATH={dirPath} && javac {filePath} && java Demo"

    print(cmd, string)
    exitcode, data = getstatusoutput(cmd)

    shutil.rmtree(dirPath)

    return exitcode == 0, data