package com.vineet.hospital.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Aspect
@Component
@Slf4j
public class ServiceLoggingAspect {

    @Around("execution(public * com.vineet.hospital.service..*(..))")
    public Object logServiceMethod(ProceedingJoinPoint joinPoint) throws Throwable {

        String className = joinPoint.getSignature()
                .getDeclaringType().getSimpleName();

        String methodName = joinPoint.getSignature().getName();

        long start = System.nanoTime();

        try {
            Object result = joinPoint.proceed();

            long duration = (System.nanoTime() - start) / 1_000_000;

            log.info("{}.{}() completed in {} ms",
                    className, methodName, duration);

            return result;

        } catch (Throwable ex) {

            long duration = (System.nanoTime() - start) / 1_000_000;

            log.error("{}.{}() failed after {} ms. Exception: {}",
                    className,
                    methodName,
                    duration,
                    ex.getClass().getSimpleName());

            throw ex;
        }
    }
}
