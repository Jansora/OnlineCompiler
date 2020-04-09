import os
from subprocess import getstatusoutput


def compiler(dirPath, string):

    filePath = os.path.join(dirPath, "Demo.py")


    with open(filePath, "w+") as fp:
        fp.write(string)


    cmd = f"python {filePath}"

    print(cmd, string)
    exitcode, data = getstatusoutput(cmd)


    return exitcode == 0, data