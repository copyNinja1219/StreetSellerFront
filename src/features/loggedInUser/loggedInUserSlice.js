import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: null,
  loadingStatus: 0,
  errorMessage: null,
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(fetchLoggedInUser(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const fetchLoggedInUser = createAsyncThunk(
  "loggedInUser/fetchLoggedInUser",
  async () => {
    const { data } = await axios.get("http://localhost:8000/api/user");
    console.log("data in fetchLoggedInUser is ", data);
    // The value we return becomes the `fulfilled` action payload

    return data;
    // return the user fetched by this request
  }
);

export const loggedInUserSlice = createSlice({
  name: "loggedInUser",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    removeErrorMessage: (state, action) => {
      state.errorMessage = null;
    },
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
    setLoading: (state, action) => {
      state.loadingStatus = 1;
    },
    unsetLoading: (state, action) => {
      state.loadingStatus = 0;
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoggedInUser.pending, (state) => {
        state.loadingStatus = 1;
      })
      .addCase(fetchLoggedInUser.fulfilled, (state, action) => {
        state.loadingStatus = 0;
        state.user = action.payload;
      })
      .addCase(fetchLoggedInUser.rejected, (state, action) => {
        state.loadingStatus = 0;

        // WE NEED TO CHANGE HERE !
        state.user = null;
      });
  },
});

export const { removeErrorMessage, setErrorMessage, setLoading, unsetLoading } =
  loggedInUserSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`

// export const selectCount = (state) => state.counter.value;
// export const selectCount = (state) => state.counter.value;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd = (amount) => (dispatch, getState) => {
//   const currentValue = getState().counter.value;

//   console.log("currentValue", currentValue);

//   if (currentValue % 2 === 1) {
//     dispatch(incrementByAmount(amount));
//   }
// };

export default loggedInUserSlice.reducer;
