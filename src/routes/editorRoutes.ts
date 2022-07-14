import { Router } from "express";
import {
  getPublishedCounties,
  getCounties,
  addCounty,
  updateCounty,
  removeCounty,
  getCountyById,
  addDistrict,
  getDistrictById,
  updateDistrictById,
  createSection,
  getSectionById,
  updateSectionById,
  deleteSection,
  createSubsection,
  getSubsectionById,
  updateSubsectionById,
  deleteSubsection,
  updateOrCreateDistrictWhyInvestIn,
  updateOrCreateEconomicData,
  updateOrCreateDistrictBusinessParks,
  updateOrCreateDistrictCouncilGrants,
  updateOrCreateDistrictCouncilServices,
  updateOrCreateDistrictLocalNews,
  updateOrCreateFeatureArticle,
  updateOrCreateOnlineDigitilisation,
  updateOrCreateCountyWelcome,
  updateOrCreateCountyNews,
  updateOrCreateCountyLEP,
  updateOrCreateSocialEnterprises,
  updateOrCreateLGBTQAndDisabilities,
  updateOrCreateMHW,
  updateOrCreateHeritageAndTourism,
  updateOrCreateCNZT,
  updateOrCreateVatAndTax,
  updateOrCreateMarketResearch,
  updateOrCreateLegalChecklist,
  updateOrCreateFindStartupFunding,
  updateOrCreateBusinessPlan,
  updateOrCreateBusinessInsurance,
  updateOrCreateBGB,
  updateOrCreateTradingOverseas,
  updateOrCreateOME,
  updateOrCreateImproveSkills,
  updateOrCreateFindTAndC,
  updateOrCreateFindNewMarkets,
  updateOrCreateFindFunding,
  updateOrCreateCommercialProperty,
  updateOrCreateDevelopProductsAndServices,
  updateOrCreateEmployPeople,
} from "../controllers/editor.controller";
import { isAdmin, restrictTo } from "../middleware/authMiddleware";

const router = Router();

router.get("/feed", getPublishedCounties);

router
  .route("/county")
  .get(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), getCounties)
  .post(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), addCounty);

router
  .route("/county/:id")
  .get(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), getCountyById)
  .put(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), updateCounty)
  .delete(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), removeCounty);

router
  .route("/district")
  .post(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), addDistrict);
router
  .route("/district/:id")
  .get(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), getDistrictById)
  .put(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), updateDistrictById);

router
  .route("/section")
  .post(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), createSection)
  .get(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), getSectionById)
  .put(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), updateSectionById)
  .delete(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), deleteSection);

router
  .route("/subsection")
  .post(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), createSubsection)
  .get(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), getSubsectionById)
  .put(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), updateSubsectionById)
  .delete(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), deleteSubsection);
router
  .route("/why-invest")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateDistrictWhyInvestIn
  );

router
  .route("/economic-data")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateEconomicData
  );

router
  .route("/business-parks")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateDistrictBusinessParks
  );

router
  .route("/council-grants")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateDistrictCouncilGrants
  );

router
  .route("/council-services")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateDistrictCouncilServices
  );

router
  .route("/local-news")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateDistrictLocalNews
  );

router
  .route("/feature-article")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateFeatureArticle
  );

router
  .route("/county-welcome")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateCountyWelcome
  );

router
  .route("/county-news")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateCountyNews
  );

router
  .route("/county-lep")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateCountyLEP
  );

// update or create route for online digitilisation
router
  .route("/online-digitilisation")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateOnlineDigitilisation
  );

// update or create route social enterprises
router
  .route("/social-enterprises")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateSocialEnterprises
  );

// update or create route LGBTQ and disabilities
router
  .route("/lgbtq-and-disabilities")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateLGBTQAndDisabilities
  );

// update or create route for mental health and wellbeing
router
  .route("/mhw")
  .put(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), updateOrCreateMHW);

// update or create route for heritage and tourism
router
  .route("/heritage-and-tourism")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateHeritageAndTourism
  );

// update or create route for carbon and net zero targets
router
  .route("/cznt")
  .put(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), updateOrCreateCNZT);

// update or create route for VAT and Tax
router
  .route("/vat-and-tax")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateVatAndTax
  );

// update or create route for market research
router
  .route("/market-research")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateMarketResearch
  );

// update or create route for legal checklist
router
  .route("/legal-checklist")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateLegalChecklist
  );

// update or create route for find startup funding
router
  .route("/find-startup-funding")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateFindStartupFunding
  );

// update or create route for business plan
router
  .route("/business-plan")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateBusinessPlan
  );

// update or create route for business insurance
router
  .route("/business-insurance")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateBusinessInsurance
  );

// update or create route for becoming a greener business
router
  .route("/bgb")
  .put(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), updateOrCreateBGB);

// update or create route for Grow a Business / trading overseas
router
  .route("/trading-overseas")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateTradingOverseas
  );

// update or create route for Grow a Business / operate more efficiently
router
  .route("/operate-more-efficiently")
  .put(isAdmin, restrictTo("SS_EDITOR", "COUNTY_EDITOR"), updateOrCreateOME);

// update or create route for Grow a Business / Improve Skills
router
  .route("/improve-skills")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateImproveSkills
  );

// update or create route for Grow a Business / Find Tenders and Contracts
router
  .route("/find-tandc")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateFindTAndC
  );

// update or create route for Grow a Business / Find New Markets
router
  .route("/find-new-markets")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateFindNewMarkets
  );

// update or create route for Grow a Business / Find Funding
router
  .route("/find-funding")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateFindFunding
  );

// update or create route for Grow a Business / Commercial Property
router
  .route("/commercial-property")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateCommercialProperty
  );
// update or create route for Grow a Business / Develop Products and Services
router
  .route("/develop-products-and-services")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateDevelopProductsAndServices
  );
// update or create route for Grow a Business / Employ People
router
  .route("/employ-people")
  .put(
    isAdmin,
    restrictTo("SS_EDITOR", "COUNTY_EDITOR"),
    updateOrCreateEmployPeople
  );

export { router };
