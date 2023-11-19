const serverApi = `https://pd7mzg-8080.csb.app`;

const getData = async () => {
    try {
        const response = await fetch(`${serverApi}/users`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi fetch: ", error);
        throw error; 
    }
};

const postData = async (data) => {
    try {
        alertify.success("Đã Thêm thành công!");
        return await fetch(`${serverApi}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            work: data.toString(),
            status: 0,
        }),
    });
    } catch (error) {
        alertify.error("Lỗi thêm: ", error);
        throw error;
    }
    
};

const deleteData = async (id) => {
    // try {
        const response = await fetch(`${serverApi}/users/${id}`, {
            method: "DELETE",
        });
        if (response.status === 200 || response.status === 204) {
            alertify.success("Đã Xóa thành công!");
            return true; // Trả về true nếu xóa thành công
        } else {
            alertify.error("Đã xảy ra lỗi không mong muốn!");
            return false; // Trả về false nếu xóa không thành công
        }
    // } catch (error) {
    //     alertify.error("Lỗi kết nối sever ở codeSanbox thôi, kệ nó đi :v");
    //     throw error; 
    // }
};

const editData = async (data, id) => {
    try {
        alertify.success("Đã sửa thành công!");
        return await fetch(`${serverApi}/users/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                work: data.toString(),
            }),
        })
        
    } catch (error) {
        alertify.error("Lỗi sửa: ", error);
        throw error;
    }
};

const statusData = async (number, id) => {
    try {
        return await fetch(`${serverApi}/users/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status: number === 1 ? 1 : 0,
            }),
        });
    } catch (error) {
        alertify.error("Lỗi sửa: ", error);
        throw error;
    }
};

export { postData, getData, deleteData, editData, statusData };
// lertify.confirm(
//     "Bạn có chắc chắn muốn sửa?",
//     async function () {},
//     async function () {
//         alertify.error("Đã hủy!");
//     }
// );