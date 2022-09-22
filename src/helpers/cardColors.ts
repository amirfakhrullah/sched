export const getColorThemes = (color: string) => {
  switch (color) {
    case "orange":
      return {
        card: "bg-[#EBAE72]",
        tag: "bg-orange-800",
      };
    case "blue":
      return {
        card: "bg-[#6EA5D8]",
        tag: "bg-blue-900",
      };
    case "green":
      return {
        card: "bg-[#6FA9B1]",
        tag: "bg-green-900",
      };
    case "purple":
      return {
        card: "bg-[#8E7CDF]",
        tag: "bg-purple-900",
      };
    case "grey":
      return {
        card: "bg-[#93989C]",
        tag: "bg-gray-900",
      };
    default:
      return {
        card: "bg-[#93989C]",
        tag: "bg-gray-900",
      };
  }
};
