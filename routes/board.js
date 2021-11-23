const express = require('express')
const router = express.Router()
const boardModel = require('../models/board')
const checkAuth = require('../middleware/check_auth')
// get boards
router.get('/', checkAuth, async (req, res) => {
    try{
        if(res.locals.user){
            const boards = await boardModel.find()
                                .populate('user', ['email'])
            res.status(200).json({
                msg : "get boards",
                count : boards.length,
                boardInfo : boards.map(board => {
                    return {
                        id : board._id,
                        user : board.user,
                        board : board.board
                    }
                })
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
// get board
router.get('/:boardId', checkAuth, async (req, res) => {
    const id =  req.params.boardId
    try{
        if(res.locals.user){
            const board = await boardModel.findById(id)
                                .populate('user', ['email'])
            if(!board){
                return res.status(402).json({
                    msg : "no boardId"
                })
            }
            else{
                res.status(200).json({
                    msg : "get board",
                    boardInfo : {
                        id : board._id,
                        user : board.user,
                        board : board.board
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
// save board
router.post('/', checkAuth, async (req, res) => {
    const {user, board} = req.body
    const newBoard = new boardModel({
        user, board
    })
    try{
        if(res.locals.user){
            const board = await newBoard.save()
            res.status(200).json({
                msg : "save board",
                boardInfo : {
                    id : board._id,
                    user : board.user,
                    board : board.board
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
// update board
router.patch('/:boardId', checkAuth, async (req, res) => {
    const id = req.params.boardId
    const updateOps = {}
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value
    }
    try{
        if(res.locals.user){
            const board = await boardModel.findByIdAndUpdate(id, {$set : updateOps})
            if(!board){
                return res.status(402).json({
                    msg : "no boardId"
                })
            }
            else{
                res.status(200).json({
                    msg : "update board by id: " + id
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
// delete boards
router.delete('/', checkAuth, async (req, res) => {
    try{
        if(res.locals.user){
            await boardModel.remove()
            res.status(200).json({
                msg : "delete boards"
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
// delete board
router.delete('/:boardId', checkAuth, async (req, res) => {
    const id = req.params.boardId
    try{
        if(res.locals.user){
            const board = await boardModel.findByIdAndRemove(id)
            if(!board){
                return res.status(402).json({
                    msg : "no boardId"
                })
            }
            else{
                res.status(200).json({
                    msg : "delete board by id: " + id
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