package com.notafiscal.nota;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import java.util.Optional;

public interface SequenciaAnualRepository extends JpaRepository<SequenciaAnual, Integer> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<SequenciaAnual> findByAno(Integer ano);
}
