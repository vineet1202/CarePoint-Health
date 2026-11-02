package com.vineet.hospital.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.vineet.hospital.model.User;
import com.vineet.hospital.model.UserPrincipal;
import com.vineet.hospital.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MyUserDetailsService implements UserDetailsService {

	private final UserRepository repo;
	
	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

		User user= repo.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
		
		if (user==null) {
			System.out.println("User 404");
			throw new UsernameNotFoundException("User 404");
		}
		 return new UserPrincipal(user);
	}

}
