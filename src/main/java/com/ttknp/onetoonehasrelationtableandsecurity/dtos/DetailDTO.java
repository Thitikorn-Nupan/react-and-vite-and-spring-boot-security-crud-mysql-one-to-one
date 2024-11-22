package com.ttknp.onetoonehasrelationtableandsecurity.dtos;

import com.ttknp.onetoonehasrelationtableandsecurity.entities.Detail;
import com.ttknp.onetoonehasrelationtableandsecurity.repositories.DetailRepo;
import com.ttknp.onetoonehasrelationtableandsecurity.services.DetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DetailDTO implements DetailService {
    private final DetailRepo detailRepo;
    @Autowired
    public DetailDTO(DetailRepo detailRepo) {
        this.detailRepo = detailRepo;
    }

    // this method will get error if detail has relation to customer
    // and i have to remove customer first
    // because i set @OneToOne on Customer class Only
    @Override
    public Boolean deleteDetail(long id) {
        // Todo Remove customer first
        return detailRepo.findById(id).map((detail) -> {
            detailRepo.delete(detail);
            return true;
        }).orElse(false);
    }

    @Override
    public Iterable<Detail> getDetails() {
        return detailRepo.findAll();
    }

    @Override
    public Detail getDetail(long id) {
        return detailRepo.findById(id).orElse(null);
    }

    @Override
    public Boolean updateDetail(Detail detail, long id) {
        return detailRepo.findById(id).map((detailFound)->{
            detailFound.setPhone(detail.getPhone());
            detailFound.setSalary(detail.getSalary());
            detailFound.setBirthday(detail.getBirthday());
            detailFound.setMaritalStatus(detail.getMaritalStatus());
            return detailRepo.save(detailFound).getDid() != null;
        }).orElse(false);
    }
}
