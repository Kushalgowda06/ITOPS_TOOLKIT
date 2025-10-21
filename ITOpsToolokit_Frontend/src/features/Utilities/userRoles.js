const userRoles = [
  {
    "roleID": "01",
    "roleName": "Admin",
    "capabilities": {
      "menuList": [
        "launchstacks",
        "finops",
        "Cloud Operations",
        "Dashbaords",
        "Reports",
        "Onboarding"
      ],
      "permission": [
        "Read",
        "Write",
        "Edit",
        "Add"
      ],
      "members": [
        "Dushyanth"
      ],
      "pages": [
        "Tagging Policy",
        "Orphan Object",
        "Cloud Advisory",
        "Manage Tagging Policy"
      ]
    }
  },
  {
    "roleID": "02",
    "roleName": "User",
    "capabilities": {
      "menuList": [
        "finops",
        "Cloud Operations",
        "Dashbaords",
        "Reports"
      ],
      "permission": [
        "Read"
      ],
      "members": [
        "Sapna",
        "Shubham"
      ],
      "pages": [
        "Tagging Policy",
        "Orphan Object",
        "Manage Tagging Policy"
      ]
    }
  }
]

export default userRoles
