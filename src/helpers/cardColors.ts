export const getColorThemes = (color: string) => {
  switch (color) {
    case "orange":
      return {
        card: "bg-[#EBAE72]",
        tag: "bg-orange-800",
        hex: "#EBAE72"
      };
    case "blue":
      return {
        card: "bg-[#6EA5D8]",
        tag: "bg-blue-900",
        hex: "#6EA5D8"
      };
    case "green":
      return {
        card: "bg-[#6FA9B1]",
        tag: "bg-green-900",
        hex: "#6FA9B1"
      };
    case "purple":
      return {
        card: "bg-[#8E7CDF]",
        tag: "bg-purple-900",
        hex: "#8E7CDF"
      };
    case "grey":
      return {
        card: "bg-[#93989C]",
        tag: "bg-gray-900",
        hex: "#93989C"
      };
    default:
      return {
        card: "bg-[#93989C]",
        tag: "bg-gray-900",
        hex: "#93989C"
      };
  }
};
