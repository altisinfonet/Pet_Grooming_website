const _URLS = {
    petType: {
        fPetTypeUrl: "/read-pet-type",
        fTagsUrl: "/read-tag",
        fAssingTagsUrl: "/read-pet-type-tags",
        uPetTypeUrl: "/update-pet-type",
        cPetTypeUrl: "/create-pet-type",
        dPetTypeUrl: "/delete-pet-type",
        fTagsForDropDownUrl: "/get-tag-dropdown"
    },
    status: {
        fStatusUrl: "/read-status"
    },
    store: {
        cStoreUrl: "/create-store",
        uMultiPermission: "/create-multi-permission",
        fStoreUrl: "/list-store",
        fStoreByIdUrl: "/get-store",
        uDMultiPermission: "/update-delete-multi-permission",
        dropDownGetUrl: "/get-store-superadmin",
        uStoreInfoUrl: "/update-store",
        getOperatorBranch: "/get-operator-branch",
        getOperatorBranchStore_st: "/get-operator-branch-with-static-store"
    },
    module: {
        fModule: "/get-all-module"
    },
    operator: {
        cOperator: "/create-operator",
        fOperatorUrl: "/list-operator",
        fOperatorByIdUrl: "/get-operator-by-id",
        uOperatorById: "/update-operator",
        dOperatorUrl: "/delete-operator"
    },
    order: {
        gOrderByIdUrl: "/view-order-byid",
        uCustomServiceUrl: "/update-custom-service",
        dCustomServiceUrl: "/delete-custom-service",
        getallTransactionUrl: "/user-all-transaction",
        generateInvoiceWithPaymentUrl: "/payment-request-for-invoice",
        get_Invoice: "/get-invoice"
    },
    dashboard: {
        getLogUrl: "/get-logs",
        getLogWithCodeUrl: "/get-logs-with-code"
    },
    dogTraining: {
        getDogTrainingUrl: "/get-dog-training",
        getDogTrainingByid: "/get-dog-training-byid",
        dropDownTrainer: "/dropdown-god-trainer",
        assignDogTrainer: "/assign-dog-trainer"
    },
    dogTrainer: {
        getTrainer: "/read-dog-trainer",
        updateStatus: "/update-status-dog-trainer",
        deleteTrainer: "/delete-dog-trainer",
    },
    banner: {
        getHeroBanner: "/get-hero-banner",
        createHeroBanner: "/create-hero-banner",
        updateHeroBanner: "/update-hero-banner",
        otherBannerCreate: "/create-others-banner",
        getOthersBanner: "/get-others-banner",
        othersBannerUpdate: "/update-others-banner"
    },
    blog: {
        createBlogCategory: "/create-blog-category",
        createBlog: "/create-blog",
        getBlogCategory: "/get-blog-category",
        getBlogCategoryImage: "/get-blog-category-image",
        getBlog: "/get-blog",
        getBlogImage: '/get-blog-image',
        updateBlogCategory: "/update-blog-category",
        updateBlog: "/update-blog",
        updateBlogStatus: "/update-blog-status",
        deleteBlogCategory: "/delete-blog-category",
        deleteBlog: "/delete-blog",
        statusUpdate: "/status-update",
        getCatOptions: "/get-cat-options",
        checkBlogSlug: "/check-blog-slug",
        checkUpdateBlogSlug: "/check-update-blog-slug"
    },
    team: {
        createTeam: "/craete-team",
        getTeam: "/get-teams",
        getTeamImage: "/get-team-image",
        updateTeam: "/update-team",
        updateTeamStatus: "/update-team-status",
        deleteTeam: "/delete-team"
    },
    customer: {
        createCustomer: "/create-customer",
        getCustomers: "/get-customers",
        updateCustomer: "/update-customer",
        updateCustomerListStatus: "/update-customer-list-status",
        deleteCustomer: "/delete-customer"
    },
    setting: {
        manageSiteOperation: "/manage-site-operation",
        getSiteOperation: "/get-site-operation"
    },
    service_ads: {
        createServiceAds: "/create-service-ads",
        getServiceAds: "/get-all-service-ads",
        getServiceAdsImage: "/get-service-ads-image",
        updateServiceAds: "/update-service-ads",
        updateServiceAdsStatus: "/update-service-ads-status",
        deleteServiceAds: "/delete-service-ads",
        get_categories: "/get-categories"
    },
    termsConditions: {
        createTAC: "/craete-tac",
        getTAC: "/get-tac",

        // getTACByStatus: "/get-tac-by-status",
        getTACByStatusActive: "/get-tac-by-status-active",
        updateTAC: "/update-tac",
        deleteTAC: "/delete-tac",
        statusUpdate: "/update-tac-status",
    },
    // client_apis: {
    //     payment: "/payment",
    //     sdfsf: "sdf"
    // }
    adminMeta: {
        metaInfo: "/meta-data",
        getMetaDataHome: "/meta-data/home",
        getMetaDataTermsConsition: "/meta-data/terms&condition",
        getMetaDataPrivacyPolicy: "/meta-data/privacyPolicy",
    }
}

const getUrlWithKey = (key) => {
    const generateUrl = new Object;
    if (_URLS[key]) {
        for (let sub_key in _URLS[key]) {
            generateUrl[sub_key] = `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}${_URLS[key][sub_key]}`
        }
    }
    return generateUrl;
}

export default getUrlWithKey;