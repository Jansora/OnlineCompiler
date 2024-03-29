package com.jansora.onlinecompiler.application;

import com.jansora.onlinecompiler.exception.BaseAppException;
import com.jansora.onlinecompiler.payload.ResultDto;
import com.jansora.onlinecompiler.util.CmdUtils;
import com.jansora.onlinecompiler.util.FileUtils;

import javax.enterprise.context.ApplicationScoped;
import java.io.File;
import java.nio.file.Paths;

/**
 * @description:
 * @author: jansora (zhang.yangyuan)
 * @date: 2022-11-16 12:17:20
 */
@ApplicationScoped
public class PythonCompiler implements Compiler {


    private static final PythonCompiler instance = new PythonCompiler();

    @Override
    public Compiler getInstance(String language) {
        return instance;
    }

    @Override
    public ResultDto compile(String code) throws BaseAppException {

        String filename = "Demo.py";
        String cwdPath = Paths.get(getCwd(), String.valueOf(code.hashCode()).replace("-", "")).toString();
        FileUtils.mkdir(cwdPath);
        String filePath = Paths.get(cwdPath, filename).toString();
        FileUtils.writeFile(new File(filePath), code, false);
        return CmdUtils.syncRun(cwdPath, "python3", filename);

    }
}
