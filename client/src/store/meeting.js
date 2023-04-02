import { createSlice } from "@reduxjs/toolkit"

const initialMeetingState = {
    meetingId: null
}

const meetingSlice = createSlice({
    name: "meeting",
    initialState: initialMeetingState,
    reducers: {
        createMeeting: (state, action) => {
            state.meetingId = action.payload?.data;
        }
    }
})

export const meetingActions = meetingSlice.actions;
export default meetingSlice.reducer;