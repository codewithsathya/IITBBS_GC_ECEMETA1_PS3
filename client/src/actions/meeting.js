import * as api from "../api"
import { meetingActions } from "../store/meeting"

export const createMeeting = () => async (dispatch) => {
    try {
        const { data } = await api.createMeeting();
        // dispatch(meetingActions.createMeeting({data}));
        localStorage.setItem("meeting-details", JSON.stringify({data: data}))
    }catch(err){
        console.log(err)
    }
}

export const inviteMembers = () => async (dispatch) => {
    try {
        await api.inviteMembers();
    } catch (error) {
        
    }
}