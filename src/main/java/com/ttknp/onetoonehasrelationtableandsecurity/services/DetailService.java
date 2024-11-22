package com.ttknp.onetoonehasrelationtableandsecurity.services;

import com.ttknp.onetoonehasrelationtableandsecurity.entities.Detail;

public interface DetailService {
    Boolean deleteDetail(long id);
    Iterable<Detail> getDetails();
    Detail getDetail(long id);
    Boolean updateDetail(Detail detail, long id);
}
