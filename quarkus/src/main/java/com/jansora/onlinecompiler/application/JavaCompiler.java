package com.jansora.onlinecompiler.application;

import com.jansora.onlinecompiler.exception.BaseAppException;
import com.jansora.onlinecompiler.exception.system.CommandException;
import com.jansora.onlinecompiler.payload.ResultDto;
import com.jansora.onlinecompiler.util.CmdUtils;
import com.jansora.onlinecompiler.util.FileUtils;

import javax.enterprise.context.ApplicationScoped;
import java.io.File;
import java.nio.file.Paths;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @description:
 * @author: jansora (zhang.yangyuan)
 * @date: 2022-11-16 12:17:20
 */
@ApplicationScoped
public class JavaCompiler implements Compiler {

    private static final Pattern PATH_PATTERN = Pattern.compile("public(\\s*)class(\\s*)(\\S+)((<.*>)|())(\\s*)\\{");

    private static final JavaCompiler instance = new JavaCompiler();
    @Override
    public Compiler getInstance(String language) {
        return instance;
    }

    @Override
    public ResultDto compile(String code) throws BaseAppException {

//        PATH_PATTERN.matcher(code);

        Matcher pathMatcher = PATH_PATTERN.matcher(code);

        if (pathMatcher.find()) {
            String filename = code.substring(pathMatcher.start(), pathMatcher.end() - 1).split("class")[1].trim() + ".java";
            String cwdPath = Paths.get(getCwd(), String.valueOf(code.hashCode()).replace("-", "")).toString();
            FileUtils.mkdir(cwdPath);
            String filePath = Paths.get(cwdPath, filename).toString();
            FileUtils.writeFile(new File(filePath), code, false);
//            String operation = System.getProperty("os.name").toLowerCase().indexOf("windows") > 0 ? "set" : "export";
//            String cmd = "cd " + cwdPath +
//                    " && " + operation + " CLASSPATH=" + cwdPath +
//                    " && javac " + filePath +
//                    " && java -Dfile.encoding=UTF-8 " + filename;
            return CmdUtils.syncRun(cwdPath, "java", "-Dfile.encoding=UTF-8", filename);
        }

        throw new CommandException();

//        pattern = re.findall("public(\s*)class(\s*)(\S+)((<.*>)|())(\s*){", string)
//
//        filename = pattern[0][2] if  len(pattern) > 0 else  "Demo"
//
//        filePath = os.path.join(dirPath, filename + ".java")
//
//        with open(filePath, "w+") as fp:
//        fp.write(string)
//
//
//        operation = "set" if platform.system() == "Windows" else "export"
//        cmd = f"cd {dirPath} && {operation} CLASSPATH={dirPath} && javac {filePath} && java -Dfile.encoding=UTF-8 {filename}"
//
//        print(cmd, string)
//        exitcode, data = getstatusoutput(cmd)
//
//
//
//        return exitcode == 0, data
//
//        return null;
    }
}
