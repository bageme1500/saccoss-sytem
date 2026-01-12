import React, { useEffect, useState } from "react"
import { userApi } from "../services/api"
import { useMutation } from "../hooks/useApi"
import { handleApiError } from "../utils/errorHandler"

export default function UpdateUser({ userId }) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role_name, setRoleName] = useState("member")

    const [msg, setMsg] = useState(null)
    const [msgType, setMsgType] = useState("success")

    const { mutate: updateUser, loading } = useMutation(userApi.update)

    /* 🔹 Load existing user */
    useEffect(() => {
        const loadUser = async () => {
            try {
                const user = await userApi.getById(userId)
                setName(user.name)
                setEmail(user.email)
                setRoleName(user.role_name)
            } catch (err) {
                setMsg(handleApiError(err))
                setMsgType("error")
            }
        }

        if (userId) loadUser()
    }, [userId])

    /* 🔹 Submit update */
    const submit = async (e) => {
        e.preventDefault()
        setMsg(null)

        const payload = {
            name,
            email,
            role_name,
            ...(password && { password }) // only send password if changed
        }

        try {
            await updateUser(
                { id: userId, data: payload },
                {
                    onSuccess: (user) => {
                        setMsg(`User "${user.name}" updated successfully.`)
                        setMsgType("success")
                        setPassword("") // clear password field
                    },
                    onError: (err) => {
                        setMsg(handleApiError(err))
                        setMsgType("error")
                    }
                }
            )
        } catch {
            // handled in callback
        }
    }

    return (
        <div className="card">
            <h3 style={{ marginBottom: "24px", fontSize: "1.25rem" }}>
                Update User
            </h3>

            <form className="form" onSubmit={submit}>
                <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        New Password <small>(optional)</small>
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Leave blank to keep current password"
                        minLength={6}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Role</label>
                    <select
                        value={role_name}
                        onChange={e => setRoleName(e.target.value)}
                    >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <button className="primary" type="submit" disabled={loading}>
                    {loading ? (
                        <>
                            <div
                                className="loading-spinner"
                                style={{ width: "16px", height: "16px", borderWidth: "2px" }}
                            />
                            <span>Updating User...</span>
                        </>
                    ) : (
                        <>
                            <span>✏️</span>
                            <span>Update User</span>
                        </>
                    )}
                </button>

                {msg && (
                    <div className={`msg ${msgType}`}>
                        {msgType === "success" ? "✓ " : "✗ "}
                        {msg}
                    </div>
                )}
            </form>
        </div>
    )
}
