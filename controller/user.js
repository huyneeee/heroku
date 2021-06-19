import User from '../model/user'

export const userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                err: "User not found"
            })
        }
        req.profile = user;
        next();
    })
}

export const Read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
}

export const List = (req, res) => {
    User.find((err, data) => {
        if (err) {
            return res.status(400).json({
                error: "k tim thay user"
            })
        }
        res.json(data);
    })
}


export const update = (req, res) => {
    // console.log(req);
    User.findOneAndUpdate(
        { _id: req.profile._id },
        { $set: req.body },
        { new: true },
        (err, user) => {
            if (err) {
                return res.status(400).json({
                    error: 'You are not authorized to perform in action'
                })
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            res.json(user);
        }
    )
}
