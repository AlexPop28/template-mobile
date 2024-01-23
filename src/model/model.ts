// TODO fill out model details for the in-memory representation
type Model = {
  id: number;
  has_data: number;
};

// TODO: set sensible defaults for missing fields
const defaultModel = {
  has_data: 0,
};

const createModel = (map: any) => {
  return { ...defaultModel, ...map };
};

// TODO create the string representation
const modelToString = (model: Model) => {
  return `Id: ${model.id}`;
};

export { Model, createModel, modelToString };
