const express = require('express')
const router = express.Router()
const commendModel = require('../models/commend')
const checkAuth = require('../middleware/check_auth')
// get commend
router.get('/:commendId', checkAuth, async (req, res) => {
    const id = req.params.commendId
    try{
        if(res.locals.user){
            const commend = await commendModel.findById(id)
                                .populate('user', ['email'])
                                .populate('board', ['board'])
            if(!commend){
                return res.status(402).json({
                    msg : "get commend",
                    commendInfo : {
                        id : commend._id,
                        user : commend.user,
                        board : commend.board,
                        commend : commend.commend
                    }
                })
            }
        }
        else{
            res.status(403).json({
                msg : "no token"
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})
// save commend
router.post('/', checkAuth, async (req, res) => {
    const {user, board, commend} = req.body
    const newCommend = new commendModel({
        user, board, commend
    })
    try{
        if(res.locals.user){
            const commend = await newCommend.save()
            res.status(200).json({
                msg : "save commend",
                commendInfo : {
                    id : commend._id,
                    user : commend.user,
                    board : commend.board,
                    commend : commend.commend
                }
            })
        }
        else{
            res.status(403).json({
                msg : "no token"
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})
// update commend
router.patch('/:commendId', checkAuth, async (req, res) => {
    const id = req.params.commendId
    const updateOps = {}
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value
    }
    try{
        if(res.locals.user){
            const commend = await commendModel.findByIdAndUpdate(id, {$set : updateOps})
            if(!commend){
                return res.status(402).json({
                    msg : "no commendId"
                })
            }
            else{
                res.status(200).json({
                    msg : "update commend by id: " + id
                })
            }
        }
        else{
            res.status(403).json({
                msg : "no token"
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})
// delete commend
router.delete('/:commendId', checkAuth, async (req, res) => {
    const id = req.params.commendId
    try{
        if(res.locals.user){
            const commend = await commendModel.findByIdAndRemove(id)
            if(!commend){
                return res.status(402).json({
                    msg : 'no commendId'
                })
            }
            else{
                res.status(402).json({
                    msg : "delete commend by id: " + id
                })
            }
        }
        else{
            res.status(403).json({
                msg : "no token"
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})
module.exports = router