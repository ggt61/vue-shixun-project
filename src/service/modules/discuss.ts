import request from "../index";

export async function getMomentListRequest(classId: number): Promise<any> {
  const result = await request.get({
    url: `/moment/${classId}`,
  });
  return result;
}

export async function getReplyListReqest(momentId: number): Promise<any> {
  const result = await request.get({
    url: `/comment/${momentId}`,
  });
  return result;
}

export async function addMomentRequest(data: any): Promise<any> {
  const result = await request.post({
    url: `/moment`,
    data,
  });
  return result;
}

export async function addReplyRequest(data: any): Promise<any> {
  const result = await request.post({
    url: `/comment`,
    data,
  });
  return result;
}

export async function removeMomentRequest(id: number): Promise<any> {
  const result = await request.delete({
    url: `/moment/${id}`,
  });
  return result;
}

export async function removeReplyRequest(id: number): Promise<any> {
  const result = await request.delete({
    url: `/comment/${id}`,
  });
  return result;
}
