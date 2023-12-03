import provinces from "@/data/tinh_tp.json";
export function GET(request) {
    const provinceId = request.nextUrl.searchParams.get("province_id");

    if (!provinceId) {
        return Response.json({
            status: "error",    
            message: "error id",
        });
    }
    const data = Object.values(provinces).filter(
        ({ parent_code }) => parent_code === provinceId
    );
    data.sort((a, b) => a.code - b.code);
    const response = {
        status: "success",
        data: Object.values(provinces),
    };
    return Response.json(response);
}
