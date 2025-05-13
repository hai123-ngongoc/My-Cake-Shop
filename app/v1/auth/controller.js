const bcrypt = require('bcrypt');
const fs = require('fs');
const saltRounds = 10;

const login = async (req, res, next) => {
    try {
        const {username, password} = req.body || {};

        let isCorrect = false;
        let userData;
        try {
            const user = fs.readFileSync(`user_${username}.json`, 'utf-8');
            console.log(user);  
            userData = JSON.parse(user);
            // research thuat toan ma hoa bcrypt dung
            const comparePassword = await bcrypt.compare(password, userData.passwordHash);

            isCorrect = comparePassword;
        } catch (error) {
            console.error(error);
            isCorrect = false;
        }

        if (isCorrect) {
            res.send({ok: true, user: userData});
        } else {
            res.send({ok: false});
        }
    } catch (error) {
        next(error);
    }
};

const register = async (req, res, next) => {
    try {
        const {username, password, name} = req.body || {};

        const passwordHash = await bcrypt.hash(password, saltRounds);

        fs.writeFileSync(`user_${username}.json`, JSON.stringify({ //tạo file mới theo tên user_<username>,json ghi thông tin vào đó:..., writeFileSync: thao tác đồng bộ
            username,
            name,
            passwordHash,
        }));

        res.json({
            username,
            name,
        });
    } catch (error) {
        next(error);
    }
}

// router.post('/register', async (req, res, next) => {
//     try {
//         const {username, password, telephone, address, dateOfBirth} = req.body;

//         if (!username || !password) {
//             return res.status(400).json({error: 'Username and password are required'});
//         }

//         const [existing] =await db.query('Select is form user where username = ?', [username]);
//         if (existing.length > 0) {
//             return res.status(409),json({error: 'Username already exists'});
//         }

//         const passwordHash = await bcrypt.hash(password, saltRounds);

//         await db.query(`
//             INSERT INTO user (username, password_hash, role, created_at)
//             VALUES (?, ?, 'user', NOW())
//             `, [username, passwordHash]);

//             res.status(201).json({Message: 'User registered successfully'});
//     } catch(error) {
//         next(error);
//     }
// });

module.exports = {
    login,
    register,
};