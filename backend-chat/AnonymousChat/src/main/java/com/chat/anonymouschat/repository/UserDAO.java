package com.chat.anonymouschat.repository;

import com.chat.anonymouschat.entity.User;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public class UserDAO {
    public static final String HASH_KEY = "User";
    private RedisTemplate template;

    public User save(User user){
        template.opsForHash().put(HASH_KEY, user.getId(), user);
        return user;
    }

    public List<User> findAll(){
        return template.opsForHash().values(HASH_KEY);
    }

    public User finduserById(UUID id){
        return (User) template.opsForHash().get(HASH_KEY, id);
    }

    public String deleteProduct(UUID id){
        template.opsForHash().delete(HASH_KEY, id);
        return "User removed";
    }
}
