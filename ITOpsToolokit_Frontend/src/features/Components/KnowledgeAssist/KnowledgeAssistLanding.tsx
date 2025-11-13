import React, { useEffect, useState, useRef } from 'react';
import HeaderBar from '../AksCluster/TitleHeader'
import { BsFileBarGraph } from "react-icons/bs";
import { RxCopy } from "react-icons/rx";
import { SiTicktick } from "react-icons/si";
import { RiMergeCellsHorizontal } from "react-icons/ri";
import { FaDatabase, FaUbuntu, FaWindows } from 'react-icons/fa';
import { IoGlobeOutline } from 'react-icons/io5';
import { LuMonitorSpeaker } from 'react-icons/lu';
import { MdOutlineSecurity } from 'react-icons/md';
import { Button, Card, Form, Modal, Table } from 'react-bootstrap';
import { Tooltip } from '@mui/material';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { current } from '@reduxjs/toolkit';
import serviceNowAxios from '../../../api/ServicenowAxios';
import { wrapIcon } from '../../Utilities/WrapIcons';
import findOcc from '../../Utilities/Findoccurence';
import { filterData } from '../../Utilities/filterData';
// import { Container, Row, Col, Table, Button, Modal, Form, InputGroup, Dropdown } from 'react-bootstrap';
import { HiCalendarDays, HiCheckCircle, HiClipboardDocumentList, HiDocumentText, HiExclamationTriangle, HiMagnifyingGlass, HiUser } from 'react-icons/hi2';
import { truncate } from 'fs';




type ApiResponse = {
  merged_article: string;
  details: Object;
};


const KnowledgeAssistLanding = () => {
  const BsFileBarGraphIcon = wrapIcon(BsFileBarGraph);
  const RxCopyIcon = wrapIcon(RxCopy);
  const SiTicktickIcon = wrapIcon(SiTicktick);
  const RiMergeCellsHorizontalIcon = wrapIcon(RiMergeCellsHorizontal);
  const FaDatabaseIcon = wrapIcon(FaDatabase);
  const FaUbuntuIcon = wrapIcon(FaUbuntu);
  const FaWindowsIcon = wrapIcon(FaWindows);
  const IoGlobeOutlineIcon = wrapIcon(IoGlobeOutline);
  const LuMonitorSpeakerIcon = wrapIcon(LuMonitorSpeaker);
  const MdOutlineSecurityIcon = wrapIcon(MdOutlineSecurity);

  const [DuplicateModalContentShow, setDuplicateModalContentShow] = useState(false);
  const [modalDuplicateDetailsShow, setModalDuplicateDetailsShow] = useState(false);
  const [modalMergedShow, setModalMergedShow] = useState(false);
  const [mergedResponse, setMergedResponse] = useState<ApiResponse>({ merged_article: " ", details: "" })

  const [duplicateArticlesResponse, setDuplicateArticlesResponse] = useState([])
  const [activeModal, setActiveModal] = useState('')
  const [knowledgeArticlesApiResponse, setKnowledgeArticlesApiResponse] = useState([])
  const [lowScoringArticles, setlowScoringArticles] = useState([])
  const [showLowScoringArticleContent, setlowScoringArticleContent] = useState(false)
  const [showLowScoringArticleDetailsContent, setshowLowScoringArticleDetailsContent] = useState(false)
  const [selectedLowScoringArticle, setSelectedLowScoringArticle] = useState<any>({})
  const [refinedArtcileResponse, setRefinedArticleResponse] = useState("");
  const [showRefinedArticleModal, setShowRefinedArticleModal] = useState(false)
  const [incidents, setIncidents] = useState([])

  useEffect(() => {
    CallKnowledgeArticles()
    callDuplicateArticles()
    callTop10Articles()
    callCategoryWiseArticle()
    console.log(knowledgeArticlesApiResponse, "knowledgeArticlesApiResponse use")

  }, [])

  useEffect(() => {
    let articles = knowledgeArticlesApiResponse.filter((curr, index) => {
      console.log(curr, "useffect")
      console.log(parseInt(curr.metadata.rating) < 3, "useEffect")
      return parseInt(curr.metadata.rating) < 3
    })
    console.log(articles, "useEffect")
    setlowScoringArticles(articles)

  }, [knowledgeArticlesApiResponse])

  console.log("lowScoringArticles", lowScoringArticles)

  const fetchIncidents = async () => {
    try {
      // Use ServiceNow axios instance to avoid authentication conflicts
      const response = await serviceNowAxios.get(`https://cisicmpengineering1.service-now.com/api/now/table/incident?sysparm_query=stateNOT IN6,7^Eassignment_group.nameINWP Operations Center^caller.name=Event Management^ORcaller.name=599350^numberININC0030752,INC0031067,INC0032140,INC0032091,INC0032082&sysparm_fields=sys_id,number,short_description,description,urgency,impact,state,priority,opened_at,caller_id,assignment_group.name,assigned_to.name`);

      const incidents = response?.data?.result || [];
      // Normalize incident data structure
      return incidents.map(incident => ({
        ...incident,
        assigned_to: incident.assigned_to?.name || incident.assigned_to?.value || incident.assigned_to || '',
        assignment_group: incident.assignment_group?.name || incident.assignment_group?.value || incident.assignment_group || '',
        priority: incident.priority?.value || incident.priority || '',
        state: incident.state?.value || incident.state || '',
        urgency: incident.urgency?.value || incident.urgency || '',
        impact: incident.impact?.value || incident.impact || '',
        caller_id: incident.caller_id?.value || incident.caller_id || '',
        type: 'incident'
      }));
    } catch (error) {
      console.error("Error fetching incidents: ", error);
      return [];
    }
  };

  useEffect(() => {
    var getIncidents = async () => {
      var fetchedIncidents: any = await fetchIncidents()
      setIncidents(fetchedIncidents)
    }
    getIncidents()
  }, [])

  console.log(incidents, "inci")

  DOMPurify.addHook('uponSanitizeElement', (node: any, data) => {
    if (node.tagName === 'H1' || node.tagName === 'H2' || node.tagName === 'H3') {
      const newNode = document.createElement('div');
      newNode.innerHTML = node.innerHTML;
      newNode.className = 'heading';

      // Replace the original node
      node.parentNode?.replaceChild(newNode, node);
    }
  });


  const callDuplicateArticles = async () => {
    try {
      const response = await axios.post(
        "https://backend.autonomousitopstoolkit.com/kb_management/api/v1/find_duplicate_knowledge_articles/",
        {
          "table_name": "Knowledge_articles"
        }, {
        auth: {
          username: 'rest',
          password: '!fi$5*4KlHDdRwdbup%ix'
        },
        headers: {
          'Content-Type': "application/json"
        }
      }
      );

      if (response.data) {
        console.log('duplicateArticles', response.data?.output?.data);
        setDuplicateArticlesResponse(response.data?.output?.data);
      }
    } catch (error) {
      console.error("Error fetching knowledge assist content:", error);
      // setKnowledgeAssistContent({
      //   error: "Failed to fetch knowledge assist content. Please try again."
      // });
    } finally {
      // setKnowledgeAssistLoading(false);
    }
  }

  const CallKnowledgeArticles = async () => {
    try {
      const response = await axios.post(
        "https://backend.autonomousitopstoolkit.com/kb_management/api/v1/retrieve_knowledge_articles/",
        {
          "table_name": "Knowledge_articles"
        }, {
        auth: {
          username: 'rest',
          password: '!fi$5*4KlHDdRwdbup%ix'
        },
        headers: {
          'Content-Type': "application/json"
        }
      }
      );

      if (response.data) {
        console.log('setKnowledgeArticlesApiResponse', response.data);
        setKnowledgeArticlesApiResponse(response.data.output.data)
      }
    } catch (error) {
      console.error("Error fetching knowledge assist content:", error);
      // setKnowledgeAssistContent({
      //   error: "Failed to fetch knowledge assist content. Please try again."
      // });
    } finally {
      // setKnowledgeAssistLoading(false);
    }
  }

  const callMergeArticles = async (articles) => {
    try {
      const response = await axios.post(
        "https://backend.autonomousitopstoolkit.com/llm/api/v1/merge_kb_articles/",
        articles, {
        auth: {
          username: 'rest',
          password: '!fi$5*4KlHDdRwdbup%ix'
        },
        headers: {
          'Content-Type': "application/json"
        }
      }
      );

      if (response.data) {
        setMergedResponse(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching knowledge assist content:", error);
      // setKnowledgeAssistContent({
      //   error: "Failed to fetch knowledge assist content. Please try again."
      // });
    } finally {
      // setKnowledgeAssistLoading(false);
    }
  }

  const [top10Artciles, setTop10Articles] = useState([])
  const [tilesData, setTilesData] = useState([])

  const callTop10Articles = async () => {
    try {
      const response = await serviceNowAxios.get(
        `https://cisicmpengineering1.service-now.com/api/now/table/kb_knowledge?sysparm_query=ORDERBYDESCsys_created_on&sysparm_fields=number%2Csys_created_on%2Crating%2Cauthor%2Cshort_description%2Csys_id%2Ccategory%2Ckb_category%2Ctext&sysparm_limit=10`
      );

      if (response.data) {
        // setTop10Articles(response.data.result)
        fetchCategoryNames(response.data.result)
      }
    } catch (error) {
      console.error("Error fetching top 10 articles :", error);
      // setKnowledgeAssistContent({
      //   error: "Failed to fetch knowledge assist content. Please try again."
      // });
    } finally {
      // setKnowledgeAssistLoading(false);
    }
  }

  const callCategoryWiseArticle = async () => {
    try {
      const response = await serviceNowAxios.get(
        `https://cisicmpengineering1.service-now.com/api/now/table/kb_knowledge?sysparm_query=kb_categoryLIKEWindows%5EORkb_categoryLIKELinux%5EORkb_categoryLIKENetwork%5EORkb_categoryLIKESecurityORkb_categoryLIKEoutlook&sysparm_limit=100`
      );

      if (response.data) {
        // setTop10Articles(response.data.result)
        // fetchCategoryNames(response.data.result)
        // console.log("SBW" , response.data)
        fetchCategoryFortiles(response.data.result)
      }
    } catch (error) {
      console.error("Error fetching top 10 articles :", error);
      // setKnowledgeAssistContent({
      //   error: "Failed to fetch knowledge assist content. Please try again."
      // });
    } finally {
      // setKnowledgeAssistLoading(false);
    }
  }

  const callRefineArticle = async (articles) => {
    // const requestBody = {}
    // Object.keys(articles).forEach((curr, index) => {
    //   requestBody[`kb_article_${index + 1}`] = articles[curr]
    // })
    console.log(articles, "refined")
    try {
      const response: any = await axios.post(
        "https://backend.autonomousitopstoolkit.com/llm/api/v1/refine_kb_articles/",
        {
          kb_article: articles
        }, {
        auth: {
          username: 'rest',
          password: '!fi$5*4KlHDdRwdbup%ix'
        },
        headers: {
          'Content-Type': "application/json"
        }
      }
      );

      if (response.data) {
        console.log(response, "response refined")
        setRefinedArticleResponse(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching knowledge assist content:", error);
      // setKnowledgeAssistContent({
      //   error: "Failed to fetch knowledge assist content. Please try again."
      // });
    } finally {
      // setKnowledgeAssistLoading(false);
    }
  }

  const fetchCategoryNames = async (articles) => {
    // const apiEndPoints = ['users', 'mastersubscriptions', 'BU', 'project', 'costCode'];
    const apiEndPoints = articles.map(curr => curr?.kb_category?.link);

    console.log(apiEndPoints, "apiEndPoints for categories")
    const apiPromises = apiEndPoints.map((type) =>
      serviceNowAxios.get(type).catch(error => {
        console.error(`Error fetching data from ${type}:`, error);
        return null;
      })
    );
    const responses = await Promise.all(apiPromises);

    console.log("promises all categories", responses)
    // setData(responseData);
    var categories = responses.map((curr: any) => curr?.data?.result?.label)

    var tempArticles = articles.map((curr, index: number) => {
      return { ...curr, category: categories[index] }
    })

    console.log("tempArticles categories", tempArticles)
    setTop10Articles(tempArticles)
    console.log("categories ", responses.map((curr: any) => curr?.data?.result?.label))
  };

  const fetchCategoryFortiles = async (articles) => {
    // const apiEndPoints = ['users', 'mastersubscriptions', 'BU', 'project', 'costCode'];
    const apiEndPoints = articles.map(curr => curr?.kb_category?.link);

    console.log(apiEndPoints, "apiEndPoints for categories")
    const apiPromises = apiEndPoints.map((type) =>
      serviceNowAxios.get(type).catch(error => {
        console.error(`Error fetching data from ${type}:`, error);
        return null;
      })
    );
    const responses = await Promise.all(apiPromises);

    console.log("promises all categories", responses)

    // setData(responseData);
    let categories = responses.map((curr: any) => curr?.data?.result?.label)

    let tempArticles = articles.map((curr, index: number) => {
      return { ...curr, category: categories[index] }
    })

    console.log("tempArticles categories", tempArticles)
    // setTop10Articles(tempArticles)
    setTilesData(tempArticles)
    // console.log("categories ", responses.map((curr: any) => curr?.data?.result?.label))
  };

  console.log(tilesData, "tilesData")

  console.log(filterData("category", tilesData), 'tiles filter')

  const output = {};
  const categories = ["Windows", "Linux", "Network"];

  for (const key in filterData("category", tilesData)) {
    for (const category of categories) {
      if (key.toLowerCase().startsWith(category.toLowerCase())) {
        // Use original casing for output keys
        output[category] = (output[category] || 0) + filterData("category", tilesData)[key].length;
        break;
      }
    }
  }
const keyNameMap = {
  grammar: "Language and Professionalism and sent it to bottom ",
  complementary: "Redundant",
  conflicting: "Contradictory",
  overlapping: "Enrichment",
};

  const mergedDetails = () => {
    console.log(mergedResponse, "duplicateArticlesResponse")
    const cleanHtml = DOMPurify.sanitize(mergedResponse?.merged_article, {
      FORBID_TAGS: ['style'],
      FORBID_ATTR: ['style', 'class'],
    });
    return mergedResponse && <>
      <div className='container text-white text-start'>
        <div className='d-flex border-bottom pb-3 border-white justify-content-between'>
          <div className="knowledge_card_title">
            <div> Merge completed successfully</div>
            <div> Combined two articles in one comprehensive articles </div>
          </div>
          <div className="d-flex gap-2 align-items-center">
            {/* <div> Original Sources </div> */}
            {/* <button className="glass-bg glass-shadow rounded px-3 text-white py-1"> KB1234</button>
            <button className="glass-bg glass-shadow rounded px-3 text-white py-1"> KB1234</button> */}
          </div>
        </div>
        <div className="row pt-3 overflow-auto" style={{ height: '60vh' }}>
          <div className="col-6">
            <span className='text-start knowledge_card_title'> Article title</span>
            <div className="glass-bg glass-shadow px-3 py-2 d-flex justify-content-between">
              <div>
                <div className='card_p'> Category </div>
                <div className='card_p'> Created by: System (Auto generated) </div>
                <div className='card_p'> Date </div>
              </div>
              <div >
                <div className='card_p'> Date </div>
                <div className='card_p'> Overall Rating </div>
              </div>

            </div>
            <p className=' knowledge_card_title'>Comprehensive Merged Content</p>
            <div className="glass-bg card_p px-3 py-2 glass-shadow">

              <div className="rendered-html text-white" dangerouslySetInnerHTML={{ __html: cleanHtml }} />
            </div>
          </div>
          <div className="col-6">
            <h6 className='knowledge_card_title'>Merge Analytics Details</h6>
            <div className="px-3 py-2">
              {
                Object.keys(mergedResponse.details).map((curr, index) => {
                   const displayName = keyNameMap[curr] || curr;
                  return <>
                    <div className='p-2 text-capitalize knowledge_card_title'>
                      {displayName}
                    </div>
                    <div className="py-2 card_p glass-bg glass-shadow">
                      {mergedResponse.details[curr].map((innerCUrr, index) => {
                        return <div className='px-2'>
                          {innerCUrr}
                        </div>
                      })}
                    </div>
                  </>
                })
              }
            </div>
          </div>
        </div>
        <div className='d-flex justify-content-center'>
          <button onClick={() => setMergedConfirmation(true)} className='d-flex glass-bg glass-shadow rounded card_p  mt-2 cursor-pointer p-2'> Submit</button>
        </div>
      </div>
    </>
  }

  const duplicateCategoryDetails = () => {
    console.log(articlesToMerged, "articlesToMerged")
    var tempArticlesToMerged: any = articlesToMerged
    var requestBodyArticles = {}
    return <div className="container h-75">
      <div className='row gx-2 overflow-auto' style={{ height: '65vh' }}>
        {
          tempArticlesToMerged && Object.keys(tempArticlesToMerged).map((curr, index) => {
            // curr = "KB!$#"
            requestBodyArticles[`kb_article_${index + 1}`] = tempArticlesToMerged[curr]?.content
            return <div className='col-6 px-3 mt-3 rounded cursor-pointer'>
              <div className='glass-bg  glass-shadow '>
                <div className="d-flex justify-content-between" >
                  <div className='p-3 text-start knowledge_card_title'>
                    <div className=''>{tempArticlesToMerged[curr]?.metadata.title}</div>
                    <div className='card_p'>{tempArticlesToMerged[curr]?.metadata.author}</div>
                  </div>
                  <div className='p-3 card_p'>Date : 12-7-2025</div>
                </div>
                <div className='card_p px-3 py-1 overflow-auto text-start' style={{ height: '40vh' }}>
                  {tempArticlesToMerged[curr]?.content}
                </div>
                <div>
                </div>
              </div>
            </div>
          })

        }
      </div>
      <div className='d-flex justify-content-end gap-3 px-3 '>
        <div onClick={() => {
          setDuplicateModalContentShow(true)
          setModalDuplicateDetailsShow(false)
        }} className='d-flex glass-bg glass-shadow rounded card_p cursor-pointer p-2'>Close</div>
        <div className='d-flex glass-bg glass-shadow rounded card_p cursor-pointer p-2' onClick={() => {
          callMergeArticles(requestBodyArticles)
          setModalMergedShow(true)
          setModalDuplicateDetailsShow(false)
        }}> Merge Articles</div>

      </div>
    </div>
  }

  const [articlesToMerged, setArticlesToMerged] = useState()

  const duplicateModalContent = () => {
    console.log(duplicateArticlesResponse, "duplicateArticlesResponse")
    return <>
      <div className='container'>
        <div className='row g-2 py-2' style={{ height: '45vh' }}>
          {
            duplicateArticlesResponse.map((curr, index: number) => {

              var articlesObject = curr[Object.keys(curr)[0]];

              if (articlesObject.length >= 1) {
                console.log(curr[Object.keys(curr)[0]][0], "tt");
              }
              // console.log()
              return curr[Object.keys(curr)[0]].length ?
                <div className='col-4 cursor-pointer' onClick={() => {
                  setModalDuplicateDetailsShow(true)
                  setDuplicateModalContentShow(false)
                  setArticlesToMerged(curr[Object.keys(curr)[0]][0])
                }}>
                  <div className='m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold text-white'>
                    <div className='d-flex justify-content-between glass-bg border glass-shadow rounded-top border-bottom-0 py-1 px-2'>
                      <div>{Object.keys(curr)[0]}</div>
                      <div className='card_p bg-light glass-bg fw-bold text-black glass-shadow rounded px-3'>{Object.keys(curr[Object.keys(curr)[0]][0]).length} duplicates</div>
                    </div>
                  </div>
                  <div className='glass-bg px-2 text-start py-3 rounded-bottom border border-top-0' style={{ height: '22vh' }}>
                    {
                      Object.keys(curr[Object.keys(curr)[0]][0]).map((InnerCurr, innerIndex) => {
                        console.log(InnerCurr, curr[Object.keys(curr)[0]][0][InnerCurr], "InnerCurr")
                        var articleContent = curr[Object.keys(curr)[0]][0][InnerCurr];
                        return <div className='py-1'>
                          <div >
                            <div className='card_p'>{articleContent?.metadata?.title}</div>
                            <div className="d-flex justify-content-between">
                              <div className='card_p'>{articleContent?.metadata?.author}</div>
                              <div className='card_p'>{InnerCurr}</div>
                            </div>
                          </div>
                        </div>
                      })}
                    {/* <div className='d-flex pt-3 justify-content-center'>
                    <div className='card_p rounded glass-bg glass-shadow px-2 py-1' onClick={() => {
                      // callMergeArticles(curr)
                    }} >
                      Merge</div>
                  </div> */}
                  </div>
                </div> : <></>
            })
          }
        </div>
      </div>

    </>
  }

  const lowScoringArticleContent = () => {
    console.log(articlesToMerged, "articlesToMerged")
    var tempArticlesToMerged: any = articlesToMerged
    var requestBodyArticles = {}
    return <div className="container h-75">

      <div className='row gx-2 overflow-auto' style={{ height: '65vh' }}>
        {
          lowScoringArticles && lowScoringArticles.map((curr: any, index) => {
            // curr = "KB!$#"
            // requestBodyArticles[`kb_article_${index + 1}`] = tempArticlesToMerged[curr]?.content
            return <div className='col-6 px-3 mt-3'>
              <div className='glass-bg  glass-shadow cursor-pointer ' onClick={() => {
                setSelectedLowScoringArticle(curr)
                setshowLowScoringArticleDetailsContent(true)
                setlowScoringArticleContent(false)
              }}>
                <div className="d-flex justify-content-between" >
                  <div className='p-3 text-start knowledge_card_title'>
                    <div className=''>{curr?.metadata.number} : {curr?.metadata.title}</div>
                    <div className='card_p'>By {curr?.metadata.author}</div>
                  </div>
                  <div className='p-3 card_p'>

                    <div className='card_p'>Rating : {curr?.metadata.rating}</div>
                    {/* <div className='card_p'>By {curr?.metadata.author}</div> */}
                  </div>
                </div>
                <div className='card_p px-3 py-1 overflow-auto text-start' style={{ height: '40vh' }}>
                  {curr?.content}
                </div>
                <div>
                </div>
              </div>
            </div>
          })

        }
      </div>
      <div className='d-flex justify-content-center gap-3 px-3 py-2'>
        <div onClick={() => setlowScoringArticleContent(false)} className='d-flex glass-bg glass-shadow rounded card_p p-2 cursor-pointer'>Close</div>
      </div>
    </div>
  }

  const lowScoringArticleDetails = () => {
    // SelectedLowScoringArticle
    console.log(selectedLowScoringArticle, "selectedLowScoringArticle")
    return selectedLowScoringArticle && <div className='container px-3 mt-3'>
      <p className='text-white knowledge_card_title'>Current Content</p>
      <div className='glass-bg  glass-shadow ' onClick={() => {
        // setSelectedLowScoringArticle(curr)
        // setshowLowScoringArticleDetailsContent(true) 
      }}>
        <div className="d-flex justify-content-between" >
          <div className='p-3 text-start knowledge_card_title'>
            <div className=''>{selectedLowScoringArticle?.metadata.number} : {selectedLowScoringArticle?.metadata.title}</div>
            <div className='card_p'>By {selectedLowScoringArticle?.metadata.author}</div>
          </div>
          <div className='p-3 card_p'>

            <div className='card_p'>Rating : {selectedLowScoringArticle?.metadata.rating}</div>
            {/* <div className='card_p'>By {selectedLowScoringArticle?.metadata.author}</div> */}

          </div>
        </div>
        <div className='card_p px-3 py-1 overflow-auto text-start' style={{ height: '40vh' }}>
          {selectedLowScoringArticle?.content}
        </div>
        <div>
        </div>
      </div>
      <div className='d-flex justify-content-center gap-3 px-3 py-2'>
        <div onClick={() => {
          setlowScoringArticleContent(true)
          setshowLowScoringArticleDetailsContent(false)
        }} className='d-flex glass-bg glass-shadow rounded card_p p-2'>Close</div>
        <div onClick={() => {
          setshowLowScoringArticleDetailsContent(false)
          setShowRefinedArticleModal(true)
          // setshowLowScoringArticleDetailsContent(false)
          callRefineArticle(selectedLowScoringArticle?.content)
        }
        } className='d-flex glass-bg glass-shadow rounded cursor-pointer card_p p-2'>Refine</div>
      </div>
    </div>
  }

  const [editingRefinedArticle, seteditingRefinedArticle] = useState(false)
  const [editableRefinedArticle, setEditableRefinedArticle] = useState<any>()

  const refinedArticleDetails = () => {
    // SelectedLowScoringArticle 
    console.log(refinedArtcileResponse, "refinedArtcileResponse")
    var cleanHtmlRefined = DOMPurify.sanitize(refinedArtcileResponse, {
      FORBID_TAGS: ['style'],
      FORBID_ATTR: ['style', 'class'],
    });
    return (refinedArtcileResponse.length > 1 && !editingRefinedArticle) ?
      <div className='container px-3 mt-3'>
        <p className='text-start text-white knowledge_card_title'>Refined Content</p>
        <div className='glass-bg  glass-shadow ' onClick={() => {
          // setSelectedLowScoringArticle(curr)
          // setshowLowScoringArticleDetailsContent(true) 
        }}>
          <div className="d-flex justify-content-between" >
            <div className='p-3 text-start knowledge_card_title'>
              <div className=''>{selectedLowScoringArticle?.metadata.number} : {selectedLowScoringArticle?.metadata.title}</div>
              <div className='card_p'>By {selectedLowScoringArticle?.metadata.author}</div>
            </div>
            <div className='p-3 card_p'>

              {/* <div className='card_p'>Rating : {selectedLowScoringArticle?.metadata.rating}</div> */}
              {/* <div className='card_p'>By {selectedLowScoringArticle?.metadata.author}</div> */}

            </div>
          </div>
          <div className='card_p px-3 py-1 overflow-auto text-start' style={{ height: '40vh' }}>
            <div className="rendered-html text-white" dangerouslySetInnerHTML={{ __html: cleanHtmlRefined }} />
          </div>
          <div>
          </div>
        </div>
        <div className='d-flex justify-content-center gap-3 px-3 py-2'>
          <div onClick={() => {
            // setShowRefinedArticleModal(false)
            // setRefinedConfirmation(true)
            const textContent = htmlToText(cleanHtmlRefined);
            setEditableRefinedArticle(textContent);
            seteditingRefinedArticle(true);
          }} className='d-flex glass-bg glass-shadow rounded cursor-pointer card_p p-2'>Edit Article </div>
          <div onClick={() => {
            setShowRefinedArticleModal(false)
            setRefinedConfirmation(true)
          }} className='d-flex glass-bg glass-shadow cursor-pointer rounded card_p p-2'>Submit</div>
        </div>
      </div> : <>

        <div>
          <div className="mb-2 p-2 mb-2 text-white " style={{
            background: 'transparent',
            borderRadius: '4px',
            fontSize: '0.8rem',
            color:"white",
            border: '1px solid #90caf9'
          }}>
            <strong>📝 Formatting Guide:</strong>
            <div style={{ marginTop: '0.5rem' }}>
              • <strong>**Bold Text**</strong>
              • <em>*Italic Text*</em> •
              <code>=== Main Heading ===</code> •
              <code>## Sub Heading</code> • <code>•
                Bullet Point</code>
            </div>
          </div>
          <Form.Control
            as="textarea"
            rows={20}
            value={editableRefinedArticle}
            onChange={(e) => setEditableRefinedArticle(e.target.value)}
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '0.8rem',
              lineHeight: '1.0',
              maxHeight: '800px',
              border: '2px solid #90caf9',
              borderRadius: '8px',
              padding: '1rem',
              background: 'transparent',
              color: 'white'
            }}
            placeholder="Edit your content here using simple formatting:

=== Main Title ===

## Section Heading

**Bold 1text** for emphasis
*Italic text* for highlights

• Bullet point 1
• Bullet point 2

Regular paragraphs separated by blank lines..."
          />
        </div>


        <div className="d-flex justify-content-center gap-3 py-2">
          <button className="m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold text-white glass-bg glass-shadow rounded px-3 text-white py-1"
            onClick={() => seteditingRefinedArticle(false)}
          >
            Cancel Changes
          </button >
          <button className="m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold text-white glass-bg glass-shadow rounded px-3 text-white py-1"

            onClick={() => {
              // Convert the edited text back to HTML format
              const htmlContent = textToHtml(editableRefinedArticle);
              // const updatedArticle = {
              //   ...editableRefinedArticle,
              //   content: editableRefinedArticle.editableTextContent || editableRefinedArticle.content,
              //   htmlContent: htmlContent
              // };
              setRefinedArticleResponse(htmlContent);
              seteditingRefinedArticle(false);
            }}

          >
            {/* <HiCheckCircle className="me-2" /> */}
            Save Changes
          </button >
        </div>


      </>
  }


  const kowledgeStats = [
    {
      title: "Duplicate Articles",
      icon: <RxCopyIcon className='fs-4' />,
      description: "Articles with similar context ",
      count: "6",
      modal: setDuplicateModalContentShow
    },
    {
      title: "Low Scoring Articles",
      icon: <BsFileBarGraphIcon className='fs-4' />,
      description: "Articles rated below 3 stars ",
      count: `${lowScoringArticles.length}`,
      modal: setlowScoringArticleContent
    },
    {
      title: "Sucess Rate",
      icon: <SiTicktickIcon className='fs-4' />,
      description: "Successfully resolved tickets",
      count: "8"
    },
    {
      title: " Merged Articles",
      icon: <RiMergeCellsHorizontalIcon className='fs-4' />,
      description: "Successfully Merged Duplicates",
      count: "8"
    }

  ]

  const top10articlesTempo = [
    {
      title: "Use Case Title",
      date: "12 Sept 2025",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt..."
    },
    {
      title: "Use Case Title",
      date: "12 Sept 2025",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt..."
    },
    {
      title: "Use Case Title",
      date: "12 Sept 2025",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt..."
    },
    {
      title: "Use Case Title",
      date: "12 Sept 2025",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt..."
    },
    {
      title: "Use Case Title",
      date: "12 Sept 2025",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt..."
    }
  ]

  const knowledgeQualityAnalysis = [
    { icon: <FaWindowsIcon className='fs-6' />, title: "Windows" },
    { icon: <FaUbuntuIcon className='fs-6' />, title: "Linux" },
    { icon: <FaDatabaseIcon className='fs-6' />, title: "Databse" },
    { icon: <IoGlobeOutlineIcon className='fs-6' />, title: "Network" },
    { icon: <MdOutlineSecurityIcon className='fs-6' />, title: "Security" },
    { icon: <LuMonitorSpeakerIcon className='fs-6' />, title: "Software" }
  ]



  function getCategoryCount(title) {
    let count = 0;
    for (const key in filterData("category", tilesData)) {
      if (key.toLowerCase().startsWith(title.toLowerCase())) {
        count += filterData("category", tilesData)[key].length;
      }
    }
    return count;
  }


  const updatedCategories = knowledgeQualityAnalysis.map(item => ({
    ...item,
    count: getCategoryCount(item.title)
  }));


  console.log(updatedCategories, "updatedCategories")
  const topArticles = [
    {
      category: "Network Troubleshooting",
      views: "543",
      descriptionTags: "Description/Tags",
      rating: '3.5'
    },
    {
      category: "Network Troubleshooting",
      views: "543",
      descriptionTags: "Description/Tags",
      rating: '3.5'
    },
    {
      category: "Network Troubleshooting",
      views: "543",
      descriptionTags: "Description/Tags",
      rating: '3.5'
    },
    {
      category: "Network Troubleshooting",
      views: "543",
      descriptionTags: "Description/Tags",
      rating: '3.5'
    },
    {
      category: "Network Troubleshooting",
      views: "543",
      descriptionTags: "Description/Tags",
      rating: '3.5'
    },

  ]
  console.log(refinedArtcileResponse, "refinedArtcileResponse.length")

  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('dateReported');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filters, setFilters] = useState({
    priority: '',
    status: '',
    category: '',
    slaStatus: '',
    assignedTo: ''
  });
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const commonIssues = [
    {
      incidents: ['INC0032512'],
      additionalCount: 0,
      short_description: 'Outlook stuck on "Trying to connect" status.',
      description: 'User is unable to send or receive emails. Outlook displays "Trying to connect" or "Disconnected" status. Issue started after a recent network change. Other applications are working fine, but Outlook fails to connect to the Exchange server.',
      priority: '5 planning',
      category: 'Enduser',
      status: 'Resolved',
      dateReported: '2025-09-02',
      assignedTo: 'Anish Bhandiwad',
      affectedUsers: 45,
      slaStatus: 'On Track',
      resolution_notes: `To restore Outlook's connection to the server, the user was guided through the following steps:
Step 1: Verify Internet and Server Access
• Confirm internet connectivity.
• Access Outlook Web Access (OWA) to check server availability.
Step 2: Flush DNS and Reset Network Stack
• Open Command Prompt as Administrator and run:
ipconfig /flushdns
netsh winsock reset
netsh int ip reset
• Restart the system.
Step 3: Repair or Recreate Outlook Profile
• Control Panel → Mail → Show Profiles → Select profile → Properties → Repair.
• If needed, create a new profile and set it as default.
Step 4: Check VPN/Proxy Settings
• Disable VPN or proxy temporarily and test Outlook connectivity.`
    },
    {
      incidents: ['INC0032515'],
      additionalCount: 0,
      short_description: 'SSH access denied for Linux server',
      description: 'A developer reported being unable to SSH into a production Linux server (RHEL 8). The error was "Permission denied (publickey)." The issue was impacting deployment activities.',
      priority: '5 -Planning',
      category: 'Linux',
      status: 'Resolved',
      dateReported: '2025-09-02',
      assignedTo: 'Anish bhandiwad',
      affectedUsers: 32,
      slaStatus: 'At Risk',
      resolution_notes: `Checked /var/log/secure for authentication logs.
Found that the user's public key was missing from ~/.ssh/authorized_keys.
Re-added the correct public key and set appropriate file permissions.
Restarted the SSH service and confirmed successful login.
User verified deployment access; ticket resolved.`
    },
    {
      incidents: ['INC0032518'],
      additionalCount: 0,
      description: 'Application team reported slow response times from the SQL Server database hosting the customer portal. Queries were taking longer than usual, affecting user experience.',
      short_description: 'SQL Server database performance degradation.',
      priority: '5-planning',
      category: 'Database',
      status: 'Resolved',
      dateReported: '2025-09-02',
      assignedTo: 'Anish Bhandiwad',
      affectedUsers: 28,
      slaStatus: 'Overdue',
      resolution_notes: `Analyzed query execution plans and identified missing indexes.
Created non-clustered indexes on frequently queried columns.
Cleared cache and restarted SQL Server services during off-peak hours.
Performance improved significantly; average query time reduced by 70%.
Monitored for 24 hours; no further issues reported.`
    },
    {
      incidents: ['INC0032519'],
      additionalCount: 0,
      short_description: 'Azure VM unreachable via RDP',
      description: 'A virtual machine hosted in Azure was reported as unreachable via RDP. The VM was hosting a critical internal application. The issue began after a recent patch deployment',
      priority: '5-planning',
      category: 'Cloud',
      status: 'Resolved',
      dateReported: '2025-09-02',
      assignedTo: 'Anish Bhandiwad',
      affectedUsers: 67,
      slaStatus: 'On Track',
      resolution_notes: `Verified VM status in Azure portal; VM was running.
Checked NSG rules and confirmed RDP port (3389) was blocked.
Modified NSG to allow inbound RDP traffic from corporate IP range.
Restarted the VM and confirmed RDP access.
Application team validated functionality; ticket closed.`
    },
    {
      incidents: ['INC0032520'],
      additionalCount: 0,
      short_description: "Domain login failure on Windows 10 workstation",
      description: `User reported being unable to log in to their Windows 10 workstation using domain credentials. The error message displayed was:
"The trust relationship between this workstation and the primary domain failed."
The issue occurred after the user returned to office after working remotely for several weeks.`,
      priority: '5-planning',
      category: 'Windows',
      status: 'Resolved',
      dateReported: '2025-09-02',
      assignedTo: 'Anish Bhandiwad',
      affectedUsers: 19,
      slaStatus: 'On Track',
      resolution_notes: `Logged in using local administrator account. Verified network connectivity and domain controller reachability. Ran nltest /sc_query:<domain> to confirm trust failure. Removed the machine from the domain and joined a temporary workgroup. Rebooted and rejoined the domain using domain admin credentials. Ran gpupdate /force and verified group policy application. User was able to log in successfully and access corporate resources. Ticket closed after validation.`
    }
  ];
  const [createdKbArticle, setCreatedKbArticle] = useState<string | undefined>(undefined);
  const [editableCreatedArticle, setEditableCreatedArticle] = useState(null);
  const [isEditingCreatedArticle, setIsEditingCreatedArticle] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const [isMerging, setIsMerging] = useState(false);

  const [showArticleDetails, setShowArticleDetails] = useState(false)
  const [selectedArtcle, setSelectedArticle] = useState([])
  const [savingCreatedKbArtilce, setSavingCreatedKbArtilce] = useState(false)
  const [mergedConfirmation, setMergedConfirmation] = useState(false)
  const [refinedConfirmation, setRefinedConfirmation] = useState(false)

  const getFilteredAndSortedData = () => {
    let filteredData = [...commonIssues];

    // Apply search filter
    if (searchQuery) {
      filteredData = filteredData.filter(issue =>
        issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.incidents.some(incident => incident.toLowerCase().includes(searchQuery.toLowerCase())) ||
        issue.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.priority.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filters.priority) {
      filteredData = filteredData.filter(issue => issue.priority === filters.priority);
    }
    if (filters.status) {
      filteredData = filteredData.filter(issue => issue.status === filters.status);
    }
    if (filters.category) {
      filteredData = filteredData.filter(issue => issue.category === filters.category);
    }
    if (filters.slaStatus) {
      filteredData = filteredData.filter(issue => issue.slaStatus === filters.slaStatus);
    }
    if (filters.assignedTo) {
      filteredData = filteredData.filter(issue => issue.assignedTo === filters.assignedTo);
    }

    // Apply sorting
    filteredData.sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case 'dateReported':
          aValue = new Date(a.dateReported);
          bValue = new Date(b.dateReported);
          break;
        case 'affectedUsers':
          aValue = a.affectedUsers;
          bValue = b.affectedUsers;
          break;
        case 'priority':
          const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
          aValue = priorityOrder[a.priority] || 0;
          bValue = priorityOrder[b.priority] || 0;
          break;
        case 'description':
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        case 'assignedTo':
          aValue = a.assignedTo.toLowerCase();
          bValue = b.assignedTo.toLowerCase();
          break;
        default:
          aValue = a[sortField];
          bValue = b[sortField];
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filteredData;
  };

  const htmlToText = (html) => {
    if (!html) return '';

    let text = html;

    // Handle complete HTML documents
    if (text.includes('<!DOCTYPE html>') || text.includes('<html')) {
      // Extract title
      const titleMatch = text.match(/<title[^>]*>(.*?)<\/title>/);
      const extractedTitle = titleMatch ? titleMatch[1].trim() : '';

      // Extract body content and ignore head/style/script
      const bodyMatch = text.match(/<body[^>]*>(.*?)<\/body>/);
      if (bodyMatch) {
        text = bodyMatch[1];
      }

      // Remove script and style tags completely
      text = text.replace(/<script[^>]*>.*?<\/script>/, '');
      text = text.replace(/<style[^>]*>.*?<\/style>/, '');
      text = text.replace(/<link[^>]*>/, '');
      text = text.replace(/<meta[^>]*>/, '');

      // Add title at the beginning if extracted
      if (extractedTitle) {
        text = `=== ${extractedTitle} ===\n\n${text}`;
      }
    }

    // Convert HTML to readable text format
    text = text
      // Convert headings first (most specific to least specific)
      .replace(/<h1[^>]*>(.*?)<\/h1>/, '\n\n=== $1 ===\n\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/, '\n\n## $1\n\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/, '\n\n### $1\n\n')
      .replace(/<h4[^>]*>(.*?)<\/h4>/, '\n\n#### $1\n\n')
      .replace(/<h5[^>]*>(.*?)<\/h5>/, '\n\n##### $1\n\n')
      .replace(/<h6[^>]*>(.*?)<\/h6>/, '\n\n###### $1\n\n')

      // Convert lists (preserve structure)
      .replace(/<ol[^>]*>/, '\n')
      .replace(/<\/ol>/, '\n')
      .replace(/<ul[^>]*>/, '\n')
      .replace(/<\/ul>/, '\n')
      .replace(/<li[^>]*>(.*?)<\/li>/, '• $1\n')

      // Convert paragraphs and divs
      .replace(/<p[^>]*>(.*?)<\/p>/, '\n\n$1\n\n')
      .replace(/<div[^>]*>(.*?)<\/div>/, '\n$1\n')

      // Convert emphasis
      .replace(/<strong[^>]*>(.*?)<\/strong>/, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/, '*$1*')

      // Convert line breaks
      .replace(/<br\s*\/?>/, '\n')

      // Remove any remaining HTML tags
      .replace(/<[^>]*>/g, '')

      // Decode HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&#8217;/g, "'")
      .replace(/&#8220;/g, '"')
      .replace(/&#8221;/g, '"')
      .replace(/&#8211;/g, '-')
      .replace(/&#8212;/g, '--')

      // Clean up whitespace
      .replace(/[ \t]+/g, ' ')           // Multiple spaces/tabs to single space
      .replace(/\n[ \t]+/g, '\n')       // Remove leading spaces on lines
      .replace(/[ \t]+\n/g, '\n')       // Remove trailing spaces on lines
      .replace(/\n{3,}/g, '\n\n')       // Multiple line breaks to double
      .replace(/^\s+|\s+$/g, '');       // Trim start and end

    return text;
  };


  // const [propsCategory, setPropsCategory] = useState([...categories])

  console.log(createdKbArticle, "createdKbArticle")

  const handleStoreCreatedArticle = async (category, selectedArtcle) => {

    var demoSOP = {
      id: 802,
      title: `${selectedArtcle[0]?.short_description}`,
      description: `${selectedArtcle[0]?.description}`,
      category: `${category}`,
      priority: `${selectedArtcle[0]?.priority}`,
      lastUpdated: `${selectedArtcle[0]?.dateReported}`,
      author: `${selectedArtcle[0]?.assignedTo}`,
      tags: ['gcp', 'gke', 'kubernetes'],
      steps: [
        `${selectedArtcle[0]?.resolution_notes}`
      ]
    }

    var tempsop = {
      "incidents": [
        "INC0032519"
      ],
      "additionalCount": 0,
      "short_description": "Azure VM unreachable via RDP",
      "description": "A virtual machine hosted in Azure was reported as unreachable via RDP. The VM was hosting a critical internal application. The issue began after a recent patch deployment",
      "priority": "5-planning",
      "category": "Cloud",
      "status": "Resolved",
      "dateReported": "2025-09-02",
      "assignedTo": "Anish Bhandiwad",
      "affectedUsers": 67,
      "slaStatus": "On Track",
      "resolution_notes": "Verified VM status in Azure portal; VM was running.\nChecked NSG rules and confirmed RDP port (3389) was blocked.\nModified NSG to allow inbound RDP traffic from corporate IP range.\nRestarted the VM and confirmed RDP access.\nApplication team validated functionality; ticket closed."
    }

    if (category) {

      // var existingCategories = [...categories].map((curr:any) => curr.name)

      // if (existingCategories.includes(category)) {
      //   console.log(category)
      //   let tempCategories = [...propsCategory]
      //   var selectedSopId
      //   tempCategories.forEach(element => {
      //     if (element.name == category) {
      //       element.count = element.count + 1
      //       selectedSopId = element.id
      //     }
      //   });

      //   // setPropsCategory(tempCategories)
      //   // console.log( "demoSOP exisiting" , demoSOP )
      // // updateSOPs(demoSOP ,selectedSopId )

      // } else {
      //   let tempCategories = [...propsCategory, {

      //     id: propsCategory.length,
      //     name: `${category}`,
      //     icon: 'FaWindows',
      //     description: `This is ${category}`,
      //     color: '#0078d4',
      //     count: 1
      //   },
      //   ]
      //   setPropsCategory(tempCategories)
      //   console.log( "demoSOP new" , demoSOP )

      //   updateSOPs(demoSOP )
      // }
      setSavingCreatedKbArtilce(false)
      setShowArticleDetails(false)
    }

  }
  const textToHtml = (text) => {
    if (!text) return '';

    // Split text into lines for better processing
    const lines = text.split('\n');
    const htmlLines = [];
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();

      if (!line) {
        // Empty line - close list if open, add spacing
        if (inList) {
          htmlLines.push('</ul>');
          inList = false;
        }
        htmlLines.push('');
        continue;
      }

      // Handle headings
      if (line.startsWith('=== ') && line.endsWith(' ===')) {
        if (inList) {
          htmlLines.push('</ul>');
          inList = false;
        }
        const title = line.slice(4, -4).trim();
        htmlLines.push(`<h1>${title}</h1>`);
      } else if (line.startsWith('## ')) {
        if (inList) {
          htmlLines.push('</ul>');
          inList = false;
        }
        htmlLines.push(`<h2>${line.slice(3).trim()}</h2>`);
      } else if (line.startsWith('### ')) {
        if (inList) {
          htmlLines.push('</ul>');
          inList = false;
        }
        htmlLines.push(`<h3>${line.slice(4).trim()}</h3>`);
      } else if (line.startsWith('#### ')) {
        if (inList) {
          htmlLines.push('</ul>');
          inList = false;
        }
        htmlLines.push(`<h4>${line.slice(5).trim()}</h4>`);
      } else if (line.startsWith('##### ')) {
        if (inList) {
          htmlLines.push('</ul>');
          inList = false;
        }
        htmlLines.push(`<h5>${line.slice(6).trim()}</h5>`);
      } else if (line.startsWith('###### ')) {
        if (inList) {
          htmlLines.push('</ul>');
          inList = false;
        }
        htmlLines.push(`<h6>${line.slice(7).trim()}</h6>`);
      }
      // Handle bullet points
      else if (line.startsWith('• ')) {
        if (!inList) {
          htmlLines.push('<ul>');
          inList = true;
        }
        const listContent = line.slice(2).trim();
        // Apply inline formatting
        const formattedContent = listContent
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>');
        htmlLines.push(`<li>${formattedContent}</li>`);
      }
      // Handle regular paragraphs
      else {
        if (inList) {
          htmlLines.push('</ul>');
          inList = false;
        }
        // Apply inline formatting
        const formattedLine = line
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>');
        htmlLines.push(`<p>${formattedLine}</p>`);
      }
    }

    // Close any open list
    if (inList) {
      htmlLines.push('</ul>');
    }

    return htmlLines.join('\n');
  };

  function cleanHtml(rawHtml) {
    // Decode HTML entities manually
    const textArea = document.createElement('textarea');
    textArea.innerHTML = rawHtml;
    const decoded = textArea.value;

    // Remove <style>...</style> tags using regex
    const withoutStyles = decoded.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    return withoutStyles;
  }
  return (
    <div className='overflow-auto'>
      <div
        className='d-flex justify-content-between justifyClass padding px-3 py-1 rounded-top background istm_header_height partialBorder glass-header-partial-border  box-shadow '
      >
        <div className="m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold text-white" style={{ letterSpacing: '1px' }}>
          Knowledge Base Overview
        </div>
        <div className="m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold text-white" style={{ letterSpacing: '1px' }}>
          Total Articles: {tilesData.length}
        </div>
      </div>
      <div className='row g-0 py-3 justify-content-around'>
        <>
          {updatedCategories.map((curr, index: number) => {
            return <>
              <div className='col knowledge-assist-glass-card text-center px-3 mx-2 py-3'>
                {/* <div className='text-white'> {curr.icon}</div> */}
                <div className="text-white fs-3 fw-bold">{curr.count}</div>
                <div className="d-flex align-items-center justify-content-center m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold pt-2 text-white">
                  <span className='px-1'>{curr.icon}</span>
                  <span className='pt-1'>{curr.title}</span>
                </div>
                {/* <div className="fs-6 text-white">{curr.description}</div> */}
              </div>
            </>
          })}
        </>
      </div>
      <>
        <div
          className='d-flex justify-content-between justifyClass padding px-3 py-1 rounded-top background istm_header_height partialBorder glass-header-partial-border  box-shadow '
        >
          <div className="m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold text-white" style={{ letterSpacing: '1px' }}>
            Knowledge Base Quality Analytics
          </div>
          {/* <div className="m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold text-white" style={{ letterSpacing: '1px' }}>
          Total articles : 10
        </div> */}
        </div>
        <div className="container px-2">
          <div className='row g-0 py-2 justify-content-around'>
            <div className='container d-flex justify-content-around'>
              {kowledgeStats.map((curr, index: number) => {
                return <>
                  <div className='col knowledge-assist-glass-card cursor-pointer text-center px-4 mx-3  py-2'
                    onClick={() => {
                      if (curr.modal) {
                        curr.modal(true)
                      }
                    }}>
                    {/* onClick={ } */}
                    <div className='text-white'> {curr.icon}</div>
                    <div className="text-white m-0 fs-3 fw-bold">{curr.count}</div>
                    <strong className="m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold text-white">{curr.title}</strong>
                    <div className="m-0 text-sm text-md text-lg text-xl text-xxl text-big text-white">{curr.description}</div>
                  </div>
                </>
              })}
            </div>
          </div>
        </div>

      </>
      {/* <p className='text-sm text-md text-lg text-xl text-xxl text-big fw-bold text-white card_p px-3'>Most Common Issues Reported Without Knowledge Base</p> */}
      <>
        <div
          className='d-flex justify-content-between justifyClass padding px-3 py-1 rounded-top background istm_header_height partialBorder glass-header-partial-border  box-shadow '
        >
          <div className="m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold text-white" style={{ letterSpacing: '1px' }}>
            Most Common Issues Reported Without Knowledge Base
          </div>
          {/* <div className="m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold text-white" style={{ letterSpacing: '1px' }}>
          Total articles : 10
        </div> */}
        </div>
        <div className="">
          <div className=" row g-0 text-center">
            <div className="col-8 table-glass-card">
              <Table className="table m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold text-white" style={{ tableLayout: 'fixed' }}>
                <thead style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', position: 'sticky', top: 0, zIndex: 10 }}>
                  <tr className='py-2'>
                    <th className="m-0 text-sm text-md text-lg text-xl text-xxl text-big text-white fw-normal" style={{ padding: '0.6rem 0.75rem', whiteSpace: 'nowrap', minWidth: '120px' }}>
                      {/* <HiClipboardDocumentList style={{ marginRight: '0.3rem' }} /> */}
                      Incident IDs
                    </th>
                    <th
                      className="m-0 text-sm text-md text-lg text-xl text-xxl text-big text-white fw-normal"
                      style={{

                        // fontWeight: '600',

                        whiteSpace: 'nowrap',
                        minWidth: '200px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                      onClick={() => handleSort('description')}
                      title="Click to sort by description"
                    >
                      {/* <HiExclamationTriangle style={{ marginRight: '0.3rem', fontSize: '0.9rem' }} /> */}
                      Issue Description
                      {sortField === 'description' && (
                        <span style={{ marginLeft: '0.3rem', fontSize: '1.1rem' }}>
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th
                      className="m-0 text-sm text-md text-lg text-xl text-xxl text-big text-white fw-normal"
                      style={{

                        // fontWeight: '600',

                        whiteSpace: 'nowrap',
                        minWidth: '90px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                      onClick={() => handleSort('priority')}
                      title="Click to sort by priority"
                    >
                      Priority
                      {sortField === 'priority' && (
                        <span style={{ marginLeft: '0.3rem', fontSize: '1.1rem' }}>
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th className="m-0 text-sm text-md text-lg text-xl text-xxl text-big text-white fw-normal"
                      style={{ padding: '0.6rem 0.75rem', whiteSpace: 'nowrap', minWidth: '120px' }}>Category</th>
                    <th className="m-0 text-sm text-md text-lg text-xl text-xxl text-big text-white fw-normal"
                      style={{



                        whiteSpace: 'nowrap',
                        minWidth: '90px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                      onClick={() => handleSort('status')}
                      title="Click to sort by status"
                    >
                      Status
                      {sortField === 'status' && (
                        <span style={{ marginLeft: '0.3rem', fontSize: '1.1rem' }}>
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th
                      className="m-0 text-sm text-md text-lg text-xl text-xxl text-big text-white fw-normal"
                      style={{

                        // fontWeight: '600',

                        whiteSpace: 'nowrap',
                        minWidth: '130px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                      onClick={() => handleSort('dateReported')}
                      title="Click to sort by date reported"
                    >
                      {/* <HiCalendarDays style={{ marginRight: '0.3rem', fontSize: '0.9rem' }} /> */}
                      Date Reported
                      {sortField === 'dateReported' && (
                        <span style={{ marginLeft: '0.3rem' }}>
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th
                      className="m-0 text-sm text-md text-lg text-xl text-xxl text-big text-white fw-normal"
                      style={{

                        // fontWeight: '600',

                        whiteSpace: 'nowrap',
                        minWidth: '140px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                      onClick={() => handleSort('assignedTo')}
                      title="Click to sort by assigned to"
                    >
                      {/* <HiUser style={{ marginRight: '0.3rem', fontSize: '0.9rem' }} /> */}
                      Assigned To
                      {sortField === 'assignedTo' && (
                        <span style={{ marginLeft: '0.3rem', fontSize: '1.1rem' }}>
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredAndSortedData().length === 0 ? (
                    <tr className="py-2">
                      <td className='py-2' style={{

                        textAlign: 'center',
                        color: 'var(--text-secondary)',
                      }}>
                        <div>
                          {/* <HiMagnifyingGlass style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.5 }} /> */}
                          <div>No issues found matching your criteria</div>
                          <div style={{ marginTop: '0.5rem' }}>
                            Try adjusting your search or filters
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    getFilteredAndSortedData().map((issue, index) => {
                      const incidentText = issue.incidents.join(' | ') + (issue.additionalCount > 0 ? ` + ${issue.additionalCount} more` : '');

                      return (
                        <tr className="cursor-pointer" key={index} onClick={() => {
                          setSelectedArticle([issue])
                          setShowArticleDetails(true)
                        }} >
                          <td style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            width: '120px'
                          }}>
                            <div className='fw-normal card_p py-1'
                              style={{
                                // fontFamily: 'monospace',
                                color: 'var(--text-secondary)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                              title={incidentText}
                            >
                              {issue.incidents.join(' | ')}
                              {issue.additionalCount > 0 && (
                                <span style={{
                                  color: 'var(--text-secondary)',
                                  // fontSize: '0.75rem',
                                  // fontWeight: '500'
                                }}>
                                  {' '}+ {issue.additionalCount} more
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{


                            // fontWeight: '500',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            width: '200px'
                          }}>
                            <span className='fw-normal card_p py-1' title={issue.description}>
                              {issue.description}
                            </span>
                          </td>
                          <td style={{
                            // padding: '0.6rem 0.75rem',
                            whiteSpace: 'nowrap'
                          }}>
                            <span
                              className='fw-normal card_p py-1'
                              style={{
                                background: 'transparent',
                                color: 'white',
                                // fontSize: '0.7rem',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '10px'
                              }}
                              title={`Priority: ${issue.priority}`}
                            >
                              {issue.priority}
                            </span>
                          </td>
                          <td style={{
                            // padding: '0.6rem 0.75rem',

                            color: 'var(--text-secondary)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            width: '120px'
                          }}>
                            <span className='fw-normal card_p py-1' title={issue.category}>
                              {issue.category}
                            </span>
                          </td>
                          <td style={{
                            // padding: '0.6rem 0.75rem',
                            whiteSpace: 'nowrap'
                          }}>
                            <span
                              className='fw-normal card_p py-1'
                              style={{
                                background: 'transparent',
                                color: 'white',
                                // fontSize: '0.7rem',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '10px'
                              }}
                              title={`Status: ${issue.status}`}
                            >
                              {issue.status}
                            </span>
                          </td>
                          <td style={{
                            // padding: '0.6rem 0.75rem',

                            color: 'var(--text-secondary)',
                            whiteSpace: 'nowrap'
                          }}>
                            <div
                              className='fw-normal card_p py-1'
                              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                              title={`Reported on: ${new Date(issue.dateReported).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}`}
                            >
                              {/* <HiCalendarDays style={{ color: '#6c757d' }} /> */}
                              {new Date(issue.dateReported).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                          </td>
                          <td style={{
                            // padding: '0.6rem 0.75rem',

                            color: 'var(--text-secondary)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            width: '140px'
                          }}>
                            <div
                              className='fw-normal card_p py-1'
                              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                              title={`Assigned to: ${issue.assignedTo}`}
                            >

                              <span className='fw-normal card_p py-1' style={{
                                // fontSize: '0.75rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {issue.assignedTo}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </Table>
            </div>
            <div className='col-4 ps-3'>
              <div className="row gx-3">
                <div className="col ">
                  <HeaderBar
                    content="Recent SOP generated"
                    position="center"
                    padding=""
                    partialBorder={true}
                  />
                  <div className='container knowledge-assist-glass- overflow-scroll' style={{ height: "40vh" }}>
                    {top10Artciles.map((curr, index: number) => {
                      return <>
                        <Card
                          className={`ticket-card knowledge-assist-glass-card text-white mb-1 overflow-auto p-2 card`}
                        // onClick={() => handleClick(ticket, index)}
                        >
                          <div className="d-flex justify-content-between card_p align-items-center">
                            <span>
                              <strong className="card_title">{curr?.number}</strong>
                            </span>
                            <span>
                              <strong className="card_title">{curr?.category}</strong>
                            </span>
                          </div>

                          <p className="mb-1 justify-content-start text-start">
                            <span>
                              <strong className="card_title">Short description :</strong>
                            </span>
                            <Tooltip
                              title={curr.description || ""}
                              placement="top"
                              arrow
                              followCursor
                              PopperProps={{
                                className: "high-z-index",
                              }}
                            >
                              <span className="cursor-pointer  card_p ps-1">
                                {curr?.short_description}
                              </span>
                            </Tooltip>
                          </p>
                        </Card>
                      </>
                    })}
                  </div>
                </div>
                {/* <div className="col-6">
                  <HeaderBar
                    content="Top Articles"
                    position="center"
                    padding=""
                    partialBorder={true}
                  />
                  <div className='px-2 knowledge-assist-glass-'>
                    {top10articlesTempo.map((curr, index: number) => {
                      return <>
                        <Card
                          className={`ticket-card knowledge-assist-glass- text-white mb-1 px-3 mt-2 py-3`}
                        // onClick={() => handleClick(ticket, index)}
                        >
                          <div className="d-flex justify-content-between card_p align-items-center">
                            <span>
                              <strong className="card_title">{curr.category}</strong>
                            </span>
                            <span>
                              <strong className="card_title">{curr.views}</strong>
                            </span>
                          </div>

                          <div className="d-flex justify-content-between card_p align-items-center">
                            <span>
                              <strong className="card_title">{curr.descriptionTags}</strong>
                            </span>
                            <span>
                              <strong className="card_title">{curr.rating}</strong>
                            </span>
                          </div>
                        </Card>
                      </>
                    })}
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* //merged details modal  */}
        <Modal
          // {...props}
          show={modalMergedShow}
          backdrop={true}
          // backdropClassName="glass-bg"
          data-bs-theme="dark" 
          onHide={() => {
            setModalDuplicateDetailsShow(true)
            setModalMergedShow(false)
          }
          }
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          // centered
          closeButton
          dialogClassName='text-white h-75'
        >
          <Modal.Header closeButton data-bs-theme="dark" className='px-3 glass-bg py-2'>
            <div className="m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold text-white" id="contained-modal-title-vcenter">
              Successfully Merged Document
            </div>
          </Modal.Header>
          <Modal.Body className='rounded knowledge-assist-glass- py-3' >
            <div>
              {
                mergedDetails()
              }
            </div>
          </Modal.Body>
        </Modal>


        {/* duplicate details modal  */}
        <Modal
          // {...props}
          show={modalDuplicateDetailsShow}
          backdrop={true}
          // backdropClassName="glass-bg"
          onHide={() => {
            setDuplicateModalContentShow(true)
            setModalDuplicateDetailsShow(false)
          }}
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          // centered
          dialogClassName='text-white h-75'
          closeButton
        >
          <Modal.Header closeButton data-bs-theme="dark" className='px-3 glass-bg py-2'>
            <div className="m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold text-white" id="contained-modal-title-vcenter">
              Category details
            </div>
          </Modal.Header>
          <Modal.Body className='rounded glass-shadow py-3'>
            <div>
              {
                duplicateCategoryDetails()
              }
            </div>
          </Modal.Body>
        </Modal>

        {/* Duplicate category details */}
        <Modal
          // {...props}
          show={DuplicateModalContentShow}
          backdrop={true}
          // backdropClassName="glass-bg"
          onHide={() => setDuplicateModalContentShow(false)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          // centered
          dialogClassName='text-white h-75'

        >
          <Modal.Header closeButton data-bs-theme="dark" className='px-3 glass-bg py-2 custom-close'>
            <div className="m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold text-white" id="contained-modal-title-vcenter">
              Categories with duplicate articles
            </div>


            <div
              // type="button"
              className="btn"
              onClick={() => {
                setDuplicateModalContentShow(false)
              }}
              style={{ color: 'white', fontSize: '1.5rem', marginLeft: 'auto' }}
            ></div>


          </Modal.Header>
          <Modal.Body className='rounded py-5'>
            <div>
              {
                duplicateModalContent()
              }
            </div>
          </Modal.Body>
        </Modal>


        {/* low scoring article  content  */}
        <Modal
          // {...props}
          show={showLowScoringArticleContent}
          backdrop={true}
          // backdropClassName="glass-bg"
          onHide={() => setlowScoringArticleContent(false)}
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          // centered
          dialogClassName='text-white h-75'
        >
          <Modal.Header closeButton data-bs-theme="dark" className='px-3 glass-bg py-2 text-white'>
            <div className="m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold text-white" id="contained-modal-title-vcenter">
              Low Scoring Articles
            </div>
          </Modal.Header>
          <Modal.Body className='rounded py-5'>
            <div>
              {
                lowScoringArticleContent()
              }
            </div>
          </Modal.Body>
        </Modal>

        {/* low scoring single article details popup content  */}
        <Modal
          // {...props}
          show={showLowScoringArticleDetailsContent}
          backdrop={true}
          // backdropClassName="glass-bg"
          onHide={() => setshowLowScoringArticleDetailsContent(false)}
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          // centered
          dialogClassName='text-white h-75'
        >
          <Modal.Header closeButton data-bs-theme="dark" className='px-3 glass-bg py-2 text-white'>
            <div className="m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold text-white" id="contained-modal-title-vcenter">
              Article details and refinement
            </div>
          </Modal.Header>
          <Modal.Body className='rounded py-1'>
            <div>
              {
                Object.keys(selectedLowScoringArticle).length && lowScoringArticleDetails()
              }
            </div>
          </Modal.Body>
        </Modal>

        {/* low scoring article refined details  */}
        <Modal
          // {...props}
          show={showRefinedArticleModal}
          backdrop={true}
          // backdropClassName="glass-bg"
          onHide={() => setShowRefinedArticleModal(false)}
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          // centered
          dialogClassName='text-white h-75'
        >
          <Modal.Header closeButton data-bs-theme="dark" className='px-3 glass-bg py-2 text-white'>
            <div className="m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold text-white" id="contained-modal-title-vcenter">
              Article refinement complete
            </div>
          </Modal.Header>
          <Modal.Body className='rounded py-1'>
            <div>
              {
                refinedArtcileResponse.length && refinedArticleDetails()
              }
            </div>
          </Modal.Body>
        </Modal>

        {/* generate article from table  */}
        <Modal
          show={showArticleDetails}
          onHide={() => {
            setShowArticleDetails(false)
            setCreatedKbArticle(null)
            // setEditableCreatedArticle();
            setIsEditingCreatedArticle(false);
          }}
          size="xl"
        >
          <Modal.Header data-bs-theme="dark" closeButton={!isMerging} className='bg-gradient-to-br glass-bg  model_header custom-modal-title from-neon-blue to-royal-500' style={{ color: 'white' }}>
            <Modal.Title className="custom-modal-title">
              {selectedArtcle.length && !createdKbArticle ? "Ticket Details" : 'Article Details'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className='card_p text-white' style={{ maxHeight: '60vh', overflowY: 'auto', position: 'relative' }}>
            <>
              {console.log(selectedArtcle[0], createdKbArticle, 'test')}

              {selectedArtcle.length && !createdKbArticle ? <div className='p-3'>
                <div className='d-flex justify-content-between '>
                  <h6 className='knowledge_card_title'> Incident ID: {selectedArtcle[0].incidents[0]} </h6>
                  <div className='d-flex'>
                    <h6 className='knowledge_card_title'>Category : </h6>
                    <h6 className='knowledge_card_title'> {selectedArtcle[0].category}</h6>
                  </div>
                </div>
                <h6 className='pt-2 knowledge_card_title'>Short Description</h6>
                <p className='text-sm'>{selectedArtcle[0].short_description}</p>
                <h6 className='pt-2 knowledge_card_title'>Description</h6>
                <p className='text-sm'>{selectedArtcle[0].description}</p>
                <h6 className='pt-2 knowledge_card_title'>Resolution Notes</h6>
                <p className='text-sm'>{selectedArtcle[0].resolution_notes}</p>

              </div> : !isEditingCreatedArticle ? <> <div className='text-start rendered-html text-white'

                dangerouslySetInnerHTML={{
                  __html: cleanHtml(DOMPurify.sanitize(createdKbArticle, {
                    FORBID_TAGS: ['style'],
                    FORBID_ATTR: ['style', 'class'],
                     KEEP_CONTENT: false,
                  }))
                }}
              /></> : <>
                <div>
                  <div className="mb-2 p-2" style={{
                    // background: '#000000',
                    borderRadius: '4px',
                    // fontSize: '1.1rem',
                    border: '1px solid #90caf9'
                  }}>
                    <strong>📝 Formatting Guide:</strong>
                    <div style={{ marginTop: '0.5rem' }}>
                      • <strong>**Bold Text**</strong>
                      • <em>*Italic Text*</em> •
                      <code>=== Main Heading ===</code> •
                      <code>## Sub Heading</code> • <code>•
                        Bullet Point</code>
                    </div>
                  </div>
                  <Form.Control
                    as="textarea"
                    rows={20}
                    value={editableCreatedArticle}
                    onChange={(e) => setEditableCreatedArticle(e.target.value)}
                    style={{
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      // fontSize: '0.95rem',
                      lineHeight: '1.6',
                      minHeight: '500px',
                      fontSize: '12px',
                      border: '2px solid #90caf9',
                      borderRadius: '8px',
                      padding: '1rem',
                      background: 'transparent',
                      color: 'white'
                    }}
                    placeholder="Edit your content here using simple formatting:

=== Main Title ===

## Section Heading

**Bold text** for emphasis
*Italic text* for highlights

• Bullet point 1
• Bullet point 2

Regular paragraphs separated by blank lines..."
                  />
                </div>
              </>}

            </>
          </Modal.Body>
          <Modal.Footer className='d-flex justify-content-center gap-3'>
            {!createdKbArticle ?
              <button className="glass-bg glass-shadow rounded px-3 text-white py-1 m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold text-white"
                disabled={isLoading}
                onClick={async () => {
                  // setShowAddModal(true);
                  try {
                    setIsLoading(true);
                    const apiUserName = 'rest'
                    const apiPass = '!fi$5*4KlHDdRwdbup%ix'

                    const response = await axios.post(
                      'https://backend.autonomousitopstoolkit.com/llm/api/v1/refine_kb_articles',
                      {
                        kb_article: `short description - ${selectedArtcle[0].short_description}- Description - ${selectedArtcle[0].description}-Resolution notes-${selectedArtcle[0].resolution_notes}`
                      },
                      {
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        auth: {
                          username: apiUserName,
                          password: apiPass
                        }
                      }
                    );

                    const data = await response.data.data;
                    // return data;
                    setCreatedKbArticle(data)
                  } catch (error) {
                    console.error('Error calling refine API:', error);
                    throw error;
                  } finally {
                    setIsLoading(false);
                    // setShowAddModal(false);
                  }
                }}>
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    {/* <HiCheckCircle className="me-2" /> */}
                    Create Article
                  </>
                )}
              </button > : <></>

            }

            {createdKbArticle ? <>
              {

                !isEditingCreatedArticle ? (
                  <>
                    <button className="m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold text-white glass-bg glass-shadow rounded px-3 text-white py-1"

                      onClick={() => {
                        // Convert HTML content to readable text for editing
                        const textContent = htmlToText(createdKbArticle);
                        setEditableCreatedArticle(textContent);
                        setIsEditingCreatedArticle(true);
                      }}

                    >
                      {/* <HiDocumentText className="me-2" /> */}
                      Edit Article
                    </button >
                    <button className="m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold text-white glass-bg glass-shadow rounded px-3 text-white py-1"

                      onClick={() => {
                        setSavingCreatedKbArtilce(true)
                        handleStoreCreatedArticle(selectedArtcle[0]?.category, selectedArtcle)
                      }}
                      disabled={savingCreatedKbArtilce}

                    >
                      {savingCreatedKbArtilce ? (
                        <>
                          <span className="m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold text-white m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold text-white spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          {/* <HiCheckCircle className="me-2" /> */}
                          Save Article
                        </>
                      )}
                    </button >
                  </>
                ) : (
                  <>
                    <button className="m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold text-white glass-bg glass-shadow rounded px-3 text-white py-1"
                      onClick={() => setIsEditingCreatedArticle(false)}
                    >
                      Cancel Changes
                    </button >
                    <button className="m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold text-white glass-bg glass-shadow rounded px-3 text-white py-1"

                      onClick={() => {
                        // Convert the edited text back to HTML format
                        const htmlContent = textToHtml(editableCreatedArticle);
                        // const updatedArticle = {
                        //   ...editableRefinedArticle,
                        //   content: editableRefinedArticle.editableTextContent || editableRefinedArticle.content,
                        //   htmlContent: htmlContent
                        // };
                        setCreatedKbArticle(htmlContent);
                        setIsEditingCreatedArticle(false);
                      }}

                    >
                      {/* <HiCheckCircle className="me-2" /> */}
                      Save Changes
                    </button >
                  </>
                )
              }
            </> : <></>
            }
          </Modal.Footer>
        </Modal>

        <Modal backdrop={true} show={mergedConfirmation} centered>
          <Modal.Header data-bs-theme="dark" closeButton={!isMerging} className=' knowledge_card_title bg-gradient-to-br from-neon-blue to-royal-500' style={{ color: 'white' }}>
            <Modal.Title>Success</Modal.Title>
          </Modal.Header>
          <Modal.Body className='text-white knowledge_card_title'>Article merged successfully</Modal.Body>
          <Modal.Footer className='d-flex justify-content-center'>
            <button className="glass-bg glass-shadow rounded px-3 text-white py-1 m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold text-white cursor-pointer" onClick={() => {
              setMergedConfirmation(false)
              setDuplicateModalContentShow(false)
              setModalDuplicateDetailsShow(false)
              setModalMergedShow(false)
            }}>
              OK
            </button>
          </Modal.Footer>
        </Modal>


        <Modal backdrop={true} show={refinedConfirmation} centered>
          <Modal.Header data-bs-theme="dark" closeButton={!isMerging} className='bg-gradient-to-br from-neon-blue to-royal-500' style={{ color: 'white' }}>
            <Modal.Title>Success</Modal.Title>
          </Modal.Header>
          <Modal.Body className='text-white'>Aricle refined successfully</Modal.Body>
          <Modal.Footer className='d-flex justify-content-center'>
            <button className="glass-bg glass-shadow rounded px-3 text-white py-1 m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold text-white cursor-pointer" onClick={() => {
              setRefinedConfirmation(false)
              setshowLowScoringArticleDetailsContent(false)
              setlowScoringArticleContent(false)
            }}>
              OK
            </button>
          </Modal.Footer>
        </Modal>

        <Modal backdrop={true} show={refinedConfirmation} centered>
          <Modal.Header data-bs-theme="dark" closeButton={!isMerging} className='bg-gradient-to-br from-neon-blue to-royal-500' style={{ color: 'white' }}>
            <Modal.Title>Success</Modal.Title>
          </Modal.Header>
          <Modal.Body className='text-white'>Aricle refined successfully</Modal.Body>
          <Modal.Footer className='d-flex justify-content-center'>
            <button className="glass-bg glass-shadow rounded px-3 text-white py-1 m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold text-white cursor-pointer" onClick={() => {
              setRefinedConfirmation(false)
              setshowLowScoringArticleDetailsContent(false)
              setlowScoringArticleContent(false)
            }}>
              OK
            </button>
          </Modal.Footer>
        </Modal>
      </>
    </div>
  )
}

export default KnowledgeAssistLanding

