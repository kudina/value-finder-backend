import express from 'express'
import Post from '../../models/Post/Index.js'
export const createPost = async (req, res, next)=>{
    console.log("alll", req.body)
    const user_id = req.user._id
    const post = new Post({
        title: req.body.title,
        user_id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        address: req.user.address,
        salary: req.body.salary,
        jobType: req.body.jobType,
        numberOfApplicants: req.body.numberOfApplicants,
        skillLevel: req.body.skillLevel,
        jobDescription: req.body.jobDescription,
        requirements: req.body.requirements  
    })
    try {
        const postCreated = await post.save()
        res.status(201).json(postCreated)
        } catch (error) {
            res.status(400).json(error)
        }
    }

export const getPost = async (req, res, next)=>{
    const allPost = await Post.find();
    return res.status(200).json({msg: "All Post", data: allPost}) 
}

export const updatePost = async(req, res) => {
    const id = req.body.id
    const user_id = req.user._id; 
    const findPost = await Post.findOne({ _id: id }); 
    const newContact = {
        user_id: req.user._id,  
        firstName: req.user.firstName, 
        lastName: req.user.lastName
       }

      

    if(findPost){
       const newme = findPost.numberOfApplicants
       let check = newme.find(user => user.user_id == user_id)
       if(check === undefined){
        newme.push(newContact)
        findPost.save()
        res.status(409).send({ msg: "Application Submitted"})
       }else{
        res.status(201).send({msg : "You have applied for this Job already"})
       }
 
    }else{
       res.status(403).json('post not found')
    }

    }


