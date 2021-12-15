import os
from subprocess import getstatusoutput
import platform
import re

def compiler(dirPath, string):


    pattern = re.findall("public(\s*)class(\s*)(\S+)((<.*>)|())(\s*){", string)

    filename = pattern[0][2] if  len(pattern) > 0 else  "Demo"

    filePath = os.path.join(dirPath, filename + ".java")

    with open(filePath, "w+") as fp:
        fp.write(string)


    operation = "set" if platform.system() == "Windows" else "export"
    cmd = f"cd {dirPath} && {operation} CLASSPATH={dirPath} && javac {filePath} && java -Dfile.encoding=UTF-8 {filename}"

    print(cmd, string)
    exitcode, data = getstatusoutput(cmd)



    return exitcode == 0, data