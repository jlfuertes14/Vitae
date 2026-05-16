export type WorkspaceSettingsPayload = {
  notifications: {
    importComplete: boolean;
    exportReady: boolean;
    aiUpdates: boolean;
    productNews: boolean;
  };
  exports: {
    format: "pdf" | "docx" | "txt";
    paper: "a4" | "letter";
    includeCover: boolean;
  };
  editor: {
    autoSave: boolean;
    smartSuggestions: boolean;
    compactSidebar: boolean;
  };
};

export const DEFAULT_WORKSPACE_SETTINGS: WorkspaceSettingsPayload = {
  notifications: {
    importComplete: true,
    exportReady: true,
    aiUpdates: true,
    productNews: false,
  },
  exports: {
    format: "pdf",
    paper: "a4",
    includeCover: false,
  },
  editor: {
    autoSave: true,
    smartSuggestions: true,
    compactSidebar: false,
  },
};
