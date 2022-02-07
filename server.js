const express = require('express')
require('./db/mongoose')
const User = require('./models/user')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users', (req, res) => {
    const user = new User(req.body)

    user.save().then(() => {
        res.send(user)
    }).catch((e) => {
        res.status(400).send(e)
    })
})

app.get('/users', (req, res) => {
    User.find({}).then((users) => {
        res.send(users)
    }).catch((e) => {
        res.status(500).send()
    })
})

app.get('/users/:id', (req, res) => {
    const _id = req.params.id
    if (!_id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send('USER ID NOT VALID')
    }

    User.findById(_id).then((user) => {
        if (!user) {
            return res.status(404).send('USER NOT FOUND')
        }

        res.send(user)
    }).catch((e) => {
        res.status(500).send(e)
    })
})

app.delete('/users/:id', (req, res) => {
    const _id = req.params.id

    if (!_id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send('USER ID NOT VALID')
    }

    User.findById(_id).then((user) => {
        if (!user) {
            return res.status(404).send('USER NOT FOUND')}

    })

    User.deleteOne({_id: _id}).then((user) => {
        res.send(user)
    }).catch((e) => {
        res.status(500).send()
    })

})

app.put('/users/:id', (req, res) => {
    const _id = req.params.id
    if (!_id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send('USER ID NOT VALID')
    }
    const query = {'_id': req.params.id}
    User.findOneAndUpdate(query, req.body, {upsert: true}, (e) => {
        if(e) return res.status(500).send(e)
        res.send("UPDATED")
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
