package com.jansora.onlinecompiler.application;

import com.jansora.onlinecompiler.exception.BaseAppException;
import com.jansora.onlinecompiler.exception.system.NotImplementException;
import com.jansora.onlinecompiler.payload.ResultDto;

/**
 * @description:
 * @author: jansora (zhang.yangyuan)
 * @date: 2022-11-16 11:39:15
 */
public interface Compiler extends WorkSpace {

    default Compiler getInstance(String language) throws NotImplementException {
        throw new NotImplementException();
    }


    /**
     * 编译代码
     */
    ResultDto compile(String code) throws BaseAppException;
}
