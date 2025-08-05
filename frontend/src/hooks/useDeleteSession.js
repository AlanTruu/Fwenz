import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteSession } from "../lib/api"
import { SESSIONS } from "./useSessions"


const useDeleteSession = (sessionID) => {
    const queryClient = useQueryClient()
    
    const {mutate, ...rest} = useMutation({
        mutationFn : () => deleteSession(sessionID),
        onSuccess : () => {
            queryClient.setQueryData([SESSIONS], (cache) => cache.filter((session) => session._id !== sessionID))
        }
    })

     return {deleteSession : mutate, ...rest}
}

export default useDeleteSession