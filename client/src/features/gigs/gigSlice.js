import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createGig, fetchGigs } from "@/services/gigService";

const initialState = {
  gigs: [],
  isLoading: false,
  error: null,
};

export const loadGigs = createAsyncThunk(
  "gigs/loadGigs",
  async (_, thunkAPI) => {
    try {
      return await fetchGigs();
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to load gigs");
    }
  }
);

export const addGig = createAsyncThunk(
  "gigs/addGig",
  async (gigData, thunkAPI) => {
    try {
      return await createGig(gigData);
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to create gig");
    }
  }
);

const gigSlice = createSlice({
  name: "gigs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadGigs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadGigs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.gigs = action.payload;
      })
      .addCase(loadGigs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addGig.fulfilled, (state, action) => {
        state.gigs.unshift(action.payload);
      });
  },
});

export default gigSlice.reducer;
