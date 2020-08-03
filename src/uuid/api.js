this.uuid = class extends ExtensionAPI {
  getAPI(context) {
    return {
      uuid: {
        async get() {
          const { generateUUID } = Cc["@mozilla.org/uuid-generator;1"].getService(
            Ci.nsIUUIDGenerator
          );
          return generateUUID()
            .toString()
            .slice(1, -1); // Discard enclosing braces
        },
      },
    };
  }
};
