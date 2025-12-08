<img width="100" height="100" alt="image" align="left" src="https://github.com/user-attachments/assets/aa0d6d54-e54d-4c6d-803b-5f8667baa98e" />

Made with 💙 at [OpenSourcePolitics](https://opensourcepolitics.eu/)

---

-> [version française](./README_FR.md)

# The problem

If you are a heavy user of Grist, you may have used the "Attachment" feature.

And if you did, you probably noticed it's not straightforward to use the attachment elsewhere.

> How do I display my documents in Grist 🤔 ?

> Can I generate links 🤷 ?

> What if I want to use my attachment in a HTML widget 😕 ?


Don't worry, I have the solution for you


# The Solution

This repository contains multiple widgets depending on your use-case.

To install a custom widget, go read [the grist documentation on widget](https://support.getgrist.com/page-widgets/) and use "custom url" with the urls belows.

## View attachments in Grist

This widget shows a view of all attachments in your column.

Use this link: 

`https://rambip.github.io/grist-attachment-widgets/viewer`




## Generate urls in Grist

This widget generates links on the fly using the grist API. You can then use these links in a markdown or html template for exemple.

Use this link: 

`https://rambip.github.io/grist-attachment-widgets/url-generator`

⚠️ The generated links are temporary. You can't use them in external websites, see the next section for permanent links.

*Note: this will only generate the URL for the first attachment in the column*


## Generate URLs for external websites.

No need for custom widget for this one !

If you want to use your attachments on external websites, you need to:
1. Make your document public (otherwise other websites can't access your images)
2. Use this formula (replace `$Attachment` by the right column name): 

```python
# extract url and document ID
url, end = SELF_HYPERLINK().split("/o/docs")
doc_id = end.split("/")[1]
# extract first attachment.
if not $Attachment:
    return None
attach_id = $Attachment.id[0]
# use API to provide attachment URL
return f"{url}/api/docs/{doc_id}/attachments/{attach_id}/download"
```

*Note: this will only generate the URL for the first attachment in the column*

# Inspiration

There is quite a lot of discussion around this topic on the french and international community forums:

- [inspiration for attachment viewer](https://community.getgrist.com/t/attachment-viewer-widget-needed/11558/3)
- [grist API funciton that makes it work](https://support.getgrist.com/code/modules/grist_plugin_api/#getaccesstoken)
