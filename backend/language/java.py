import os
from subprocess import getstatusoutput
import platform


def compiler(dirPath, string):

    filePath = os.path.join(dirPath, "Demo.java")


    with open(filePath, "w+") as fp:
        fp.write(string)


    operation = "set" if platform.system() == "Windows" else "export"
    cmd = f"cd {dirPath} && {operation} CLASSPATH={dirPath} && javac {filePath} && java Demo"

    print(cmd, string)
    exitcode, data = getstatusoutput(cmd)



    return exitcode == 0, data