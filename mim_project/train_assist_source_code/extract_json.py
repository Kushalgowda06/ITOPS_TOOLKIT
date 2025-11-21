import json

def extract_and_validate_json(llm_resp):

    def RawJSONDecoder(index):
        class _RawJSONDecoder(json.JSONDecoder):
            end = None

            def decode(self, s, *_):
                data, self.__class__.end = self.raw_decode(s, index)
                return data
        return _RawJSONDecoder

    def extract_json(s, index=0):
        results = []
        while (index := s.find('{', index)) != -1:
            try:
                json_obj = json.loads(s, cls=(decoder := RawJSONDecoder(index)))
                results.append(json_obj)
                index = decoder.end
            except json.JSONDecodeError as e:
                return (f'ERROR: {e}', [])
        return ('OK', results)

    (validation, json_data) = extract_json(llm_resp)


    return json_data
             
