import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import * as db from "./database";
import * as server from "./service";
// TODO rename Model
import Toast from "react-native-root-toast";
import { Model } from "../model/model";

interface Repository {
  objects: Model[];
  isLoading: boolean;
  isOffline: boolean;
  retryFetch: () => Promise<void>;
  add: (obj: Model) => Promise<void>;
  update: (updatedObj: Model) => Promise<void>;
  remove: (id: number) => Promise<void>;
  getById: (id: number) => Promise<Model>;
}

const RepositoryContext = createContext<Repository | undefined>(undefined);

const RepositoryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [objects, setObjects] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [socket, _setSocket] = useState<WebSocket | null>();
  const [isOffline, setIsOffline] = useState(true);

  // TODO: handle server error (it is already logged)
  const handleServerError = (e: any) => {
    if (e.code === "ERR_NETWORK") {
      setIsOffline(true);
      Toast.show("There was a network error.", {
        duration: Toast.durations.LONG,
      });
    } else {
      Toast.show(`Server error: ${e.toString()}`, {
        duration: Toast.durations.LONG,
      });
    }
  };
  const handleDbError = (_e: any) => {};

  const getAll = async (): Promise<void> => {
    try {
      const doesLocalTableExist = await db.doesTableExist();
      if (doesLocalTableExist) {
        const localObjects = await db.getAll();
        console.log("The local db was used before. Using the local objects.");
        setObjects(localObjects);
      } else {
        try {
          const serverObjects = await server.getAll(setIsLoading);
          setIsOffline(false);
          setObjects(serverObjects);
          serverObjects.forEach((obj: Model) => {
            db.add(obj).catch(handleDbError);
          });
        } catch (e: any) {
          handleServerError(e);
        }
      }
    } catch (e: any) {
      handleDbError(e);
    }
  };

  // const handleWebSocketMessage = (obj: Model) => {
  //   // TODO: make sure that the object here has the [Model] type
  //   db.add(obj)
  //     .then(() => {
  //       setObjects((objects) => [...objects, obj]);
  //     })
  //     .catch(handleError);
  // };

  // const tryWebSocketSetup = () => {
  //   console.log("Trying socket setup...");
  //   if (socket !== null) return;
  //   // TODO: change id and route of ws
  //   const ip = "192.168.0.184:8000";
  //   const ws_route = "";
  //   const ws = new WebSocket(`ws://${ip}/${ws_route}/`);

  //   ws.onopen = () => {
  //     console.log("Socket connected!");
  //     setSocket(ws);
  //   };

  //   ws.onmessage = (e: any) => {
  //     const message = JSON.parse(e.data);
  //     handleWebSocketMessage(message);
  //   };

  //   ws.onerror = (e) => {
  //     console.error("WebSocket encountered an error:", e);
  //     ws.close();
  //   };

  //   ws.onclose = (e) => {
  //     console.log("Socket connection closed", e.code, e.reason);
  //     setSocket(null);
  //     setTimeout(tryWebSocketSetup, 3000);
  //   };
  // };

  useEffect(() => {
    getAll();
    return () => {
      if (socket) {
        // state.socket.close();
      }
    };
  }, []);

  const repository: Repository = {
    objects,
    retryFetch: getAll,
    isOffline,
    isLoading,
    // add,
    // update,
    // getById,
    // remove,
  };

  return (
    <RepositoryContext.Provider value={repository}>
      {children}
    </RepositoryContext.Provider>
  );
};

const useRepository = () => {
  const context = useContext(RepositoryContext);
  if (!context) {
    throw new Error("useRepository should be used within a RepositoryProvider");
  }
  return context;
};

export { Repository, RepositoryProvider, useRepository };
