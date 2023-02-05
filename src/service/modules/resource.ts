import request from "../index";

export async function getResourceListRequest(classId: number): Promise<any> {
  const result = request.get({
    url: `/resource/${classId}`,
  });
  return result;
}
export async function addResourceRequest(data: any): Promise<any> {
  const result = request.post({
    url: `/upload/resource`,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data,
  });
  return result;
}
export async function removeResourceRequest(id: number): Promise<any> {
  const result = request.delete({
    url: `/resource`,
    data: {
      id,
    },
  });
  return result;
}
