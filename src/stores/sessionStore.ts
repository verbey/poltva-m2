import { create } from "zustand";
import { ICreateClientOpts } from "matrix-js-sdk";

interface SessionStore {
  clientData: ICreateClientOpts[];
  addClientData: (newClientData: ICreateClientOpts) => void;
  activeClientIndex: number;
  setActiveClientIndex: (newActiveClientUserId: string) => void;
}

const useSessionStore = create<SessionStore>()((set) => ({
  clientData: [],
  addClientData: (newClientData) =>
    set((state) => ({
      clientData: [...state.clientData, newClientData],
    })),
  activeClientIndex: 0,
  setActiveClientIndex: (newActiveClientUserId) => {
    set((state) => ({
      activeClientIndex: state.clientData.findIndex(
        (MatrixClient) => MatrixClient.userId === newActiveClientUserId
      ),
    }));
  },
}));

export default useSessionStore;
