import request from "../index";

export async function getVideoListRequest(classId: number): Promise<any> {
  const result = request.get({
    url: `/video/${classId}`,
  });
  return result;
}
export async function addVideoRequest(data: any): Promise<any> {
  const result = request.post({
    url: `/upload/video`,
    headers: { "Content-Type": "multipart/form-data" },
    data,
  });
  return result;
}
export async function updateVideoRequest(data: any): Promise<any> {
  const result = request.patch({
    url: `/upload/video`,
    headers: { "Content-Type": "multipart/form-data" },
    data,
  });
  return result;
}
export async function removeVideoRequest(id: number): Promise<any> {
  const result = request.delete({
    url: `/video`,
    data: {
      id,
    },
  });
  return result;
}
