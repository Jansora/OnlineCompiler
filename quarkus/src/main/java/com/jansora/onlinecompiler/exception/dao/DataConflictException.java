package com.jansora.onlinecompiler.exception.dao;

import com.jansora.onlinecompiler.exception.BaseAppException;

/**
 * <Description> <br>
 *
 * @author zhang.yangyuan (jansora)
 * 2020/12/02 15:47:59
 */
public class DataConflictException extends BaseAppException {

    public DataConflictException() {
        super("409", "服务器已存在重复资源");
    }
    public DataConflictException(String errorDesc) {
        super("409", errorDesc);
    }
}
