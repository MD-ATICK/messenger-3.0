

exports.addUser = (users, user, socketid) => {
    const checkUser = users.find((u) => u._id === user._id)

    if (!checkUser) {
        users.push({ ...user, socketid: socketid })
    }

}