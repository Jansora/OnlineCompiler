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
public class NodeCompiler implements Compiler {


    private static final NodeCompiler instance = new NodeCompiler();
    @Override
    public Compiler getInstance(String language) {
        return instance;
    }

    @Override
    public ResultDto compile(String code) throws BaseAppException {


        String filename = "Demo.js";
        String cwdPath = getCwd(code);
        String filePath = Paths.get(cwdPath, filename).toString();
        FileUtils.writeFile(new File(filePath), code, false);
        return CmdUtils.syncRun(cwdPath, "node", filename);

    }
}
