import request from "../index";

export async function getClassListRequest(id: number): Promise<any> {
  const reuslt = await request.get({
    url: `/class/${id}`,
  });
  return reuslt;
}

export async function addClassRequest(
  id: number,
  className: string
): Promise<any> {
  const reuslt = await request.post({
    url: `/class/${id}`,
    data: {
      name: className,
    },
  });
  return reuslt;
}
export async function updateClassRequest(
  id: number,
  className: string
): Promise<any> {
  const reuslt = await request.patch({
    url: `/class/${id}`,
    data: {
      name: className,
    },
  });
  return reuslt;
}
export async function removeClassRequest(id: number): Promise<any> {
  const reuslt = await request.delete({
    url: `/class/${id}`,
  });
  return reuslt;
}
