/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter, createSelector } from '@reduxjs/toolkit';

import { actions as channelsActions } from './channelsSlice.js';

const messagesAdapter = createEntityAdapter();
const initialState = messagesAdapter.getInitialState({
  hasAdd: false,
  historyLength: 0,
});

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessages: messagesAdapter.addMany,
    addMessage: messagesAdapter.addOne,
    setHasAdd: (state, { payload }) => { state.hasAdd = payload; },
    setHistoryLength: (state, { payload }) => { state.historyLength = payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(channelsActions.removeChannel, (state, action) => {
        const channelId = action.payload;
        const restEntities = Object.values(state.entities).filter((e) => e.channelId !== channelId);
        messagesAdapter.setAll(state, restEntities);
      });
  },
});

const selectorsAdapter = messagesAdapter.getSelectors((state) => state.messages);
const selectHasAdd = (state) => state.messages.hasAdd;
const selectHistoryLength = (state) => state.messages.historyLength;

const selectMessagesByChannelId = (id) => createSelector([
  selectorsAdapter.selectAll, selectHistoryLength,
], (messages, historyLength) => {
  const selectedMessages = messages.filter((m) => m.channelId === id)
    .slice(-historyLength);
  return selectedMessages;
});

export const { actions } = messagesSlice;
export const selectors = {
  ...selectorsAdapter,
  selectHasAdd,
  selectHistoryLength,
  selectMessagesByChannelId,
};
export default messagesSlice.reducer;
