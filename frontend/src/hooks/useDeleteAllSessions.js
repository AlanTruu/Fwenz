import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteAllSessions } from "../lib/api"
import { SESSIONS } from "./useSessions"
import { useNavigate } from "react-router-dom"

const useDeleteAllSessions = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const {mutate, ...rest} = useMutation({
        mutationFn : deleteAllSessions,
        onSuccess : () => {
            queryClient.removeQueries({SESSIONS, exact : true})
            navigate('/login', {replace : true})
        }
    })

    return {clearSessions : mutate, ...rest}
}

export default useDeleteAllSessions
